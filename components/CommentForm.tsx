'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface CommentFormProps {
  postId: string
  onCommentAdded: () => void
}

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isLoading) return

    setIsLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: content.trim() })
      })

      if (response.ok) {
        setContent('')
        onCommentAdded()
      } else {
        const data = await response.json()
        setError(data.error || '댓글 작성에 실패했습니다.')
      }
    } catch (error) {
      setError('댓글 작성 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="p-4 text-center text-gray-500">
        댓글을 작성하려면 로그인이 필요합니다.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
      {error && (
        <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      
      <div className="flex space-x-3">
        <div className="flex-1">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={!content.trim() || isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '작성 중...' : '댓글'}
        </button>
      </div>
    </form>
  )
} 