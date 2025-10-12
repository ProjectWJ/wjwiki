import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { deleteBlobFile } from '@/lib/blob-utils'; // 🚨 Blob 삭제 유틸리티 임포트

export const runtime = 'nodejs'; // Node.js 런타임에서 안정적으로 실행

/**
 * 미사용 미디어를 정리하는 Cron Job API Route입니다.
 * 1. PENDING (고아 파일) 정리: 24시간 이상 된 파일 삭제
 * 2. SCHEDULED_FOR_DELETION (삭제 예약) 정리: 예약 시간이 지난 파일 삭제
 */
export async function GET() {
    console.log('--- Starting Media Clean-up Cron Job ---');
    const now = new Date();
    
    // -----------------------------------------------------------
    // 1. 고아 파일 (PENDING) 정리: 1시간 이상 된 PENDING 파일
    // -----------------------------------------------------------
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 24000); // 24시간 제한

    const pendingFiles = await prisma.media.findMany({
        where: {
            status: 'PENDING',
            created_at: {
                lt: oneHourAgo, // created_at이 1시간 전보다 작은(오래된) 파일
            },
        },
    });

    // -----------------------------------------------------------
    // 2. 삭제 예약 파일 (SCHEDULED_FOR_DELETION) 정리: 예약 시간이 지난 파일
    // -----------------------------------------------------------
    const scheduledFiles = await prisma.media.findMany({
        where: {
            status: 'SCHEDULED_FOR_DELETION',
            scheduled_delete_at: {
                lte: now, // scheduled_delete_at이 현재 시각보다 같거나 작은(지난) 파일
            },
        },
    });

    const filesToDelete = [...pendingFiles, ...scheduledFiles];
    let deleteCount = 0;

    if (filesToDelete.length === 0) {
        console.log('No files found for clean-up.');
        return NextResponse.json({ success: true, message: 'No files to delete.' });
    }

    // -----------------------------------------------------------
    // 3. 실제 삭제 로직 실행
    // -----------------------------------------------------------
    const deletionPromises = filesToDelete.map(async (file) => {
        try {
            // Blob 스토리지에서 파일 삭제
            await deleteBlobFile(file.blob_url);

            // DB 레코드 삭제 (Blob 삭제 성공 시에만)
            await prisma.media.delete({
                where: { id: file.id },
            });
            deleteCount++;

        } catch (error) {
            // Blob 삭제 실패 시, DB 레코드를 남겨두어 다음 실행 시 재시도하거나 수동 확인을 유도합니다.
            console.error(`Failed to delete media record for ${file.blob_url}:`, error);
        }
    });

    await Promise.all(deletionPromises);

    console.log(`--- Clean-up finished. Total files deleted: ${deleteCount} ---`);
    return NextResponse.json({ 
        success: true, 
        deletedCount: deleteCount, 
        message: `Successfully deleted ${deleteCount} files.` 
    });
}