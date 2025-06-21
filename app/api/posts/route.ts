import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth'
import { PostsResponse } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // 커서가 있는 경우 해당 커서 이후의 데이터를 가져옴
    const where = cursor ? {
      createdAt: {
        lt: new Date(cursor) // createdAt이 커서보다 작은 (더 오래된) 데이터
      }
    } : {}
    
    // 최신순으로 정렬하고 limit + 1개를 가져와서 다음 페이지 존재 여부 확인
    const posts = await prisma.post.findMany({
      where,
      orderBy: {
        createdAt: 'desc' // 최신순 정렬
      },
      take: limit + 1, // 다음 페이지 존재 여부를 확인하기 위해 1개 더 가져옴
      include: {
        author: {
          select: {
            id: true,
            username: true
          }
        }
      }
    })
    
    // 다음 페이지 존재 여부 확인
    const hasMore = posts.length > limit
    const postsToReturn = hasMore ? posts.slice(0, limit) : posts
    
    // 다음 커서 계산 (마지막 게시물의 createdAt을 ISO 문자열로 변환)
    const nextCursor = hasMore && postsToReturn.length > 0 
      ? postsToReturn[postsToReturn.length - 1].createdAt.toISOString()
      : null
    
    const response: PostsResponse = {
      posts: postsToReturn.map(post => ({
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString()
      })),
      nextCursor,
      hasMore
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const { content } = await request.json()
    
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
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
    
    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        authorId: decoded.userId
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
    
    return NextResponse.json({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
} 