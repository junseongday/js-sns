import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth'
import { CommentRequest, CommentResponse } from '@/types'

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    // 인증 토큰 검증
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    
    if (!token) {
      return NextResponse.json(
        { error: '인증 토큰이 필요합니다.' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      )
    }

    const { content }: CommentRequest = await request.json()
    
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: '댓글 내용은 필수입니다.' },
        { status: 400 }
      )
    }

    // 게시물 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: params.postId }
    })

    if (!post) {
      return NextResponse.json(
        { error: '게시물을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 사용자 존재 확인
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
    
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: decoded.userId,
        postId: params.postId
      },
      include: {
        author: {
          select: {
            id: true,
            username: true
          }
        }
      }
    })
    
    const response: CommentResponse = {
      comment: {
        ...comment,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString()
      }
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: '댓글 작성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // 게시물 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: params.postId }
    })

    if (!post) {
      return NextResponse.json(
        { error: '게시물을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
    
    const comments = await prisma.comment.findMany({
      where: {
        postId: params.postId
      },
      orderBy: {
        createdAt: 'asc' // 댓글은 시간순으로 정렬
      },
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            username: true
          }
        }
      }
    })
    
    return NextResponse.json({
      comments: comments.map(comment => ({
        ...comment,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString()
      }))
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: '댓글을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 