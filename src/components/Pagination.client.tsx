// src/components/Pagination.client.tsx
"use client";

import { useSearchParams } from 'next/navigation';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
// getPostsByCategory를 통해 카테고리가 이미 설정되어 있을 수 있으므로, 해당 정보도 URL에 유지해야 합니다.

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function CustomPagination({ currentPage, totalPages }: PaginationProps) {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category'); // 현재 category 쿼리 값을 가져옵니다.

  const handlePageChange = (page: number) => {
    // 1. 새 URLSearchParams 객체를 생성하여 기존 category 값을 유지합니다.
    const newParams = new URLSearchParams();
    if (currentCategory) {
      newParams.set('category', currentCategory);
    }
    
    // 2. page 쿼리 매개변수를 설정합니다.
    newParams.set('page', String(page));
    
    // 3. Next.js router를 사용하여 새 URL로 이동합니다.
    // pathname은 현재 경로를 가정합니다. ('/posts/all')
    const newUrl = `/posts/all?${newParams.toString()}`;
    // router.push(newUrl);
    return newUrl;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? handlePageChange(currentPage - 1) : undefined}
          />
        </PaginationItem>
        {/* 10페이지 넘게 게시물 생기면 페이지 끊고 아래 주석 활용해서 로직 업데이트할것 */}
        {/* 아직 10페이지 넘었을 때 페이징처리 로직 안만듦 */}
        {/* (totalPages - currentPage) > 10 ? <PaginationEllipsis /> : "" */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem
            key={page}
          >
            <PaginationLink 
              href={handlePageChange(page)}
              isActive={page === currentPage ? true : false}
            >
            {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext 
            href={currentPage < totalPages ? handlePageChange(currentPage + 1) : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}