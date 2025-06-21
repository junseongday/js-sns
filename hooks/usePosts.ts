import useSWRInfinite from 'swr/infinite'
import { PostsResponse, PostsRequest } from '@/types'

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export function usePosts(limit: number = 10) {
  const getKey = (pageIndex: number, previousPageData: PostsResponse | null) => {
    // 첫 페이지이거나 이전 페이지에 더 많은 데이터가 있는 경우
    if (pageIndex === 0 || (previousPageData && previousPageData.hasMore)) {
      const params = new URLSearchParams()
      if (previousPageData?.nextCursor) {
        params.append('cursor', previousPageData.nextCursor)
      }
      params.append('limit', limit.toString())
      return `/api/posts?${params.toString()}`
    }
    return null
  }

  const {
    data,
    error,
    isLoading,
    size,
    setSize,
    mutate
  } = useSWRInfinite<PostsResponse>(getKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    onError: (err) => {
      console.error('SWR Error:', err)
    }
  })

  const posts = data ? data.flatMap(page => page.posts) : []
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined")
  const isEmpty = data?.[0]?.posts.length === 0
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.hasMore === false)
  const isRefreshing = isLoading && data && data.length === size

  return {
    posts,
    error,
    isLoading,
    isLoadingMore,
    isEmpty,
    isReachingEnd,
    isRefreshing,
    loadMore: () => setSize(size + 1),
    refresh: () => mutate()
  }
} 