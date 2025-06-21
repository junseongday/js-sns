'use client'

import { useState } from 'react'
import { Post } from '@/types'
import CommentForm from './CommentForm'
import CommentList from './CommentList'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState(post.comments || [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return '방금 전'
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`
    return date.toLocaleDateString('ko-KR')
  }

  const handleCommentAdded = () => {
    // 댓글이 추가되면 댓글 목록을 새로고침
    fetchComments()
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments)
      }
    } catch (error) {
      console.error('댓글을 불러오는 중 오류가 발생했습니다:', error)
    }
  }

  const toggleComments = () => {
    if (!showComments) {
      fetchComments()
    }
    setShowComments(!showComments)
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
      {/* 게시물 헤더 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {post.author.username.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {post.author.username}
            </div>
            <div className="text-sm text-gray-500">
              {formatDate(post.createdAt)}
            </div>
          </div>
        </div>
      </div>

      {/* 게시물 내용 */}
      <div className="p-4">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* 댓글 섹션 */}
      <div className="border-t border-gray-200">
        {/* 댓글 토글 버튼 */}
        <button
          onClick={toggleComments}
          className="w-full px-4 py-3 text-left text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
        >
          댓글 {comments.length}개 {showComments ? '숨기기' : '보기'}
        </button>

        {/* 댓글 목록 */}
        {showComments && (
          <>
            <CommentList comments={comments} />
            <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
          </>
        )}
      </div>
    </div>
  )
} 