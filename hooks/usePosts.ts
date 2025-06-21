import useSWRInfinite from 'swr/infinite'
import { PostsResponse, Post } from '@/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

// SWR 키 생성 함수
const getKey = (pageIndex: number, previousPageData: PostsResponse | null) => {
  // 첫 페이지이거나 이전 페이지에 더 많은 데이터가 있는 경우
  if (pageIndex === 0) {
    return '/api/posts?limit=10'
  }
  
  // 이전 페이지가 없거나 더 이상 데이터가 없는 경우
  if (!previousPageData || !previousPageData.hasMore) {
    return null
  }
  
  // 다음 페이지 요청
  return `/api/posts?cursor=${previousPageData.nextCursor}&limit=10`
}

export function usePosts() {
  const {
    data,
    error,
    isLoading,
    isValidating,
    size,
    setSize,
    mutate
  } = useSWRInfinite<PostsResponse>(getKey, fetcher, {
    revalidateFirstPage: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  // 모든 게시물을 평면화
  const posts: Post[] = data ? data.flatMap(page => page.posts) : []
  
  // 로딩 상태
  const isLoadingMore = isValidating && size > 0
  
  // 더 많은 데이터가 있는지 확인
  const hasMore = data && data[data.length - 1]?.hasMore
  
  // 다음 페이지 로드
  const loadMore = () => {
    if (hasMore && !isLoadingMore) {
      setSize(size + 1)
    }
  }

  return {
    posts,
    error,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    mutate
  }
} 