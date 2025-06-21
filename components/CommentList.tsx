import { Comment } from '@/types'

interface CommentListProps {
  comments: Comment[]
}

export default function CommentList({ comments }: CommentListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return '방금 전'
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`
    return date.toLocaleDateString('ko-KR')
  }

  if (comments.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        아직 댓글이 없습니다.
      </div>
    )
  }

  return (
    <div className="border-t border-gray-200">
      {comments.map((comment) => (
        <div key={comment.id} className="p-4 border-b border-gray-100 last:border-b-0">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {comment.author.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900 text-sm">
                  {comment.author.username}
                </span>
                <span className="text-gray-500 text-xs">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-800 text-sm leading-relaxed">
                {comment.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 