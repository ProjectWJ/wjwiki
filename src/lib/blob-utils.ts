import { del } from '@vercel/blob';

/**
 * Blob 스토리지에서 지정된 URL의 파일을 삭제합니다.
 * @param url 삭제할 파일의 Blob URL
 */
export async function deleteBlobFile(url: string): Promise<void> {
    try {
        await del(url);
        console.log(`Blob file deleted successfully: ${url}`);
    } catch (error) {
        // 파일을 찾지 못하거나(404) 다른 오류가 발생할 수 있습니다.
        // 클라우드 서비스의 일시적 오류일 수 있으므로 로깅만 하고 DB 로직을 중단하지 않습니다.
        console.error(`Error deleting Blob file ${url}:`, error);
        // 필요에 따라 에러를 다시 던질 수 있지만, Cron Job의 연속성을 위해 로깅으로 충분합니다.
    }
}