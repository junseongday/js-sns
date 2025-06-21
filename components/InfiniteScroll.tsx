'use client'

import { useEffect, useRef, useCallback } from 'react'

interface InfiniteScrollProps {
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
  children: React.ReactNode
}

export default function InfiniteScroll({ 
  onLoadMore, 
  hasMore, 
  isLoading, 
  children 
}: InfiniteScrollProps) {
  const observerRef = useRef<HTMLDivElement>(null)

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasMore && !isLoading) {
        onLoadMore()
      }
    },
    [hasMore, isLoading, onLoadMore]
  )

  useEffect(() => {
    const element = observerRef.current
    if (!element) return

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '100px', // 100px 전에 로드 시작
      threshold: 0.1
    })

    observer.observe(element)

    return () => observer.unobserve(element)
  }, [handleObserver])

  return (
    <div>
      {children}
      {hasMore && (
        <div ref={observerRef} className="py-4 text-center">
          {isLoading ? (
            <div className="text-gray-500">게시물을 불러오는 중...</div>
          ) : (
            <div className="text-gray-400">스크롤하여 더 많은 게시물 보기</div>
          )}
        </div>
      )}
      {!hasMore && (
        <div className="py-8 text-center text-gray-500">
          모든 게시물을 불러왔습니다.
        </div>
      )}
    </div>
  )
} 