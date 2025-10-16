// 필요한 모듈들을 import (Mocking을 위해 실제 모듈 경로로 변경 필요)
// 예를 들어, 'sharp', 'put', 'getFileExtension', 'generateUUID', 'fetch' 등을 Mock 해야 함.
import { put } from '@vercel/blob';
import sharp from 'sharp';
import { getFileExtension, generateUUID } from './utils';

// Mock 함수 설정 (실제 환경에 따라 Mock 구현이 달라질 수 있음)
const mockFetch = jest.fn(fetch);
const mockSharp = jest.fn(sharp);
const mockPut = jest.fn(put);
const mockGetFileExtension = jest.fn(getFileExtension);
const mockGenerateUUID = jest.fn(generateUUID);

// 모듈 경로를 가정한 Mock 설정 (실제 프로젝트 구조에 맞게 경로 수정 필요)
jest.mock('node-fetch', () => ({ default: mockFetch })); // fetch를 mock
jest.mock('sharp', () => (buffer: Buffer) => ({
  resize: jest.fn().mockReturnThis(),
  webp: jest.fn().mockReturnThis(),
  toBuffer: jest.fn().mockResolvedValue(Buffer.from('mocked image data'))
})); // sharp를 mock
// put, getFileExtension, generateUUID 등도 Mock 설정 필요

import { generateResizedImagesSharp } from './utils'; // 실제 함수 파일 경로로 변경

describe('generateResizedImagesSharp', () => {

  beforeEach(() => {
    // 각 테스트 전에 Mock 함수 초기화
    jest.clearAllMocks();

    // 기본 이미지 파일 확장자 설정
    mockGetFileExtension.mockReturnValue(".jpg"); 

/*     // Mock API 응답 설정
    mockFetch.mockResolvedValue({
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(100)) // 목업 버퍼
    });

    // Mock put 함수 응답 설정
    mockPut
      .mockResolvedValueOnce({ url: "mock_thumbnail_url" }) // 썸네일 업로드
      .mockResolvedValueOnce({ url: "mock_medium_url" }); // 중간 화질 업로드
 */
  });

  // ---

  test('동영상 파일은 즉시 기본 URL을 반환해야 함', async () => {
    // 동영상 확장자 Mock
    mockGetFileExtension.mockReturnValue(".mp4");
    const originalUrl = "http://example.com/video.mp4";

    const result = await generateResizedImagesSharp(originalUrl);

    expect(result.thumbnailUrl).toBe("https://hyamwcz838h4ikyf.public.blob.vercel-storage.com/default_thumbnail_video%20%282%29%20%282%29.png");
    expect(result.mediumUrl).toBe(originalUrl);
    expect(result.originalUrl).toBe(originalUrl);
    expect(mockFetch).not.toHaveBeenCalled(); // 동영상은 fetch를 호출하면 안됨
  });

  // ---

  test('이미지 파일은 썸네일과 중간 화질을 생성하고 URL을 반환해야 함', async () => {
    const originalUrl = "http://example.com/image.jpg";

    const result = await generateResizedImagesSharp(originalUrl);

    // 반환 값 확인
    expect(result.thumbnailUrl).toBe("mock_thumbnail_url");
    expect(result.mediumUrl).toBe("mock_medium_url");
    expect(result.originalUrl).toBe(originalUrl);

    // 주요 함수 호출 확인
    expect(mockFetch).toHaveBeenCalledWith(originalUrl);
    expect(mockSharp).toHaveBeenCalledTimes(2); // 썸네일, 중간 화질
    expect(mockPut).toHaveBeenCalledTimes(2); // 썸네일, 중간 화질 업로드
  });
  
  // 필요한 경우 에러 처리 등 추가 테스트 작성...
});