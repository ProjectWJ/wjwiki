// app/api/media/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get('url');

    if (!url) {
    return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
    }

    // -------------------------------
    // 1️⃣ 미디어 메타 조회 (DB)
    // -------------------------------
    const originalMedia = await prisma.media.findUnique({
        where: { medium_url: url },
        select: {
            blob_url: true,
            is_public: true,
            original_name: true,
        }
    });

    // 못찾으면 404 리턴
    if(!originalMedia) return NextResponse.json({ error: '404 Not Found' }, { status: 404 });


    // -------------------------------
    // 2️⃣ 비공개 미디어 접근 체크
    // -------------------------------
    if(!originalMedia.is_public) {
        const session = await auth();
        
        if (!session || !session.user) {
            return new NextResponse('Access Denied.', { status: 403 });
        }
    }

    // -------------------------------
    // 3️⃣ Blob fetch
    // -------------------------------
    try {
        const response = await fetch(originalMedia.blob_url);
        if (!response.ok) {
            throw new Error(`Failed to fetch media: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'application/octet-stream';

        // Headers 객체 생성
        const headers = new Headers();
        const filename = encodeURIComponent(originalMedia.original_name);
        headers.set('Content-Type', contentType);
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        headers.set('Content-Disposition', `inline; filename="${filename}"; filename*=UTF-8''${filename};`);
        return new NextResponse(Buffer.from(arrayBuffer), {
            status: 200,
            headers,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
    }
}
