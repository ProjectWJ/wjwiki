import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { deleteBlobFile } from '@/lib/blob-utils'; // 🚨 Blob 삭제 유틸리티 임포트

export const dynamic = 'force-dynamic';

/**
 * 미사용 미디어를 정리하는 Cron Job API Route입니다.
 * 1. PENDING (고아 파일) 정리: 12시간 이상 된 파일 삭제
 * 2. SCHEDULED_FOR_DELETION (삭제 예약) 정리: 예약 시간이 지난 파일 삭제
 */
export async function GET(req: Request) {

    console.log('--- TEST LOG: Cron Job Successfully Triggered ---');

    return NextResponse.json({ success: true, message: 'Test succeed' });
/* 
    // Vercel에서는 Cron 호출 시 x-vercel-cron 헤더 자동 첨부
    // 정식 Cron에서 온 요청만 처리하도록 보호
    // 필요시 환경변수 토큰 병행
    if (!req.headers.get("x-vercel-cron")) {
        return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    console.log('--- Starting Media Clean-up Cron Job ---');
    const now = new Date();
    
    // -----------------------------------------------------------
    // 1. 고아 파일 (PENDING) 정리: 12시간 이상 된 PENDING 파일
    // -----------------------------------------------------------
    const halfDayAgo = new Date(now.getTime() - 60 * 60 * 12000); // 12시간 제한

    const pendingFiles = await prisma.media.findMany({
        where: {
            status: 'PENDING',
            created_at: {
                lt: halfDayAgo, // created_at이 12시간 전보다 작은(오래된) 파일
            },
        },
        select: {
            id: true,
            blob_url: true,
            medium_url: true,
            thumbnail_url: true
        }
    });

    // 현재 미디어에서 즉시 삭제되고 있어서 2번 로직은 현재 작동 X
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
        select: {
            id: true,
            blob_url: true,
            medium_url: true,
            thumbnail_url: true,
        }
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

        // Blob 스토리지에서 파일 삭제: 세 가지 URL을 Promise.all로 묶어 병렬 삭제
        // url이 없는 경우를 대비해 filter로 유효한 url만 남기기
        const urlsToDelete = [file.blob_url, file.medium_url, file.thumbnail_url].filter(url => url);
        
        // 각 URL에 대해 deleteBlobFile을 호출하는 Promise 배열 생성
        const blobDeletionPromises = urlsToDelete.map(url => deleteBlobFile(url));

        // 모든 Blob 삭제 작업이 완료될 때까지 대기
        await Promise.all(blobDeletionPromises);
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
    }); */
}