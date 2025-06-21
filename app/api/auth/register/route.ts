import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { RegisterRequest, RegisterResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { email, username, password }: RegisterRequest = await request.json()

    // 입력 검증
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: '이메일, 사용자명, 비밀번호는 필수입니다.' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '비밀번호는 최소 6자 이상이어야 합니다.' },
        { status: 400 }
      )
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      )
    }

    // 중복 검사
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: '이미 사용 중인 이메일입니다.' },
          { status: 409 }
        )
      }
      if (existingUser.username === username) {
        return NextResponse.json(
          { error: '이미 사용 중인 사용자명입니다.' },
          { status: 409 }
        )
      }
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password)

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // JWT 토큰 생성
    const token = generateToken(user.id)

    const response: RegisterResponse = {
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      },
      token
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('회원가입 오류:', error)
    return NextResponse.json(
      { error: '회원가입 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 