'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import PostForm from '@/components/PostForm'
import PostCard from '@/components/PostCard'
import InfiniteScroll from '@/components/InfiniteScroll'
import { usePosts } from '@/hooks/usePosts'
import AuthPage from '@/components/AuthPage'
import { Post } from '@/types'

export default function Home() {
  const { user, logout, isLoading } = useAuth()
  const { posts, error, isLoading: postsLoading, isLoadingMore, hasMore, loadMore, mutate } = usePosts()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreatePost = async (content: string) => {
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        const newPost = await response.json()
        // 새 게시물을 피드 맨 위에 추가
        mutate(
          (data) => {
            if (!data) return data
            const newData = [...data]
            if (newData[0]) {
              newData[0] = {
                ...newData[0],
                posts: [newPost, ...newData[0].posts]
              }
            }
            return newData
          },
          false // 서버에서 다시 가져오지 않고 로컬 상태만 업데이트
        )
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 로딩 중이면 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </div>
    )
  }

  // 로그인하지 않은 경우 인증 페이지 표시
  if (!user) {
    return <AuthPage />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">오류가 발생했습니다</h1>
          <p className="text-gray-600">게시물을 불러오는 중 문제가 발생했습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">SNS 피드</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">안녕하세요, {user.username}님!</span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>
      
      <div className="max-w-2xl mx-auto py-8 px-4">
        <PostForm onSubmit={handleCreatePost} isLoading={isSubmitting} />
        
        <InfiniteScroll
          onLoadMore={loadMore}
          hasMore={hasMore}
          isLoading={isLoadingMore}
        >
          {postsLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">게시물을 불러오는 중...</div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">아직 게시물이 없습니다.</div>
            </div>
          ) : (
            posts.map((post: Post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </InfiniteScroll>
      </div>
    </div>
  )
} 