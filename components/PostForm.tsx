'use client'

import { useState } from 'react'

interface PostFormProps {
  onSubmit: (content: string) => void
  isLoading?: boolean
}

export default function PostForm({ onSubmit, isLoading = false }: PostFormProps) {
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim() && !isLoading) {
      onSubmit(content.trim())
      setContent('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="무슨 생각을 하고 계신가요?"
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          disabled={isLoading}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!content.trim() || isLoading}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '게시 중...' : '게시하기'}
        </button>
      </div>
    </form>
  )
} 