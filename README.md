# 🚀 SNS 피드 (Cursor-based Paging with Next.js & Prisma)

<p align="center">
  <img src="https://user-images.githubusercontent.com/9510055/273370282-2e2e6b2e-2e2e-4e2e-8e2e-2e2e6b2e2e2e.png" width="200" alt="SNS Feed Logo" />
</p>

<p align="center">
  <b>Next.js App Router + Prisma + SWR로 구현한 커서 기반 무한 스크롤 SNS 피드</b><br/>
  <sub>회원가입, 로그인, JWT 인증, 최신순 피드, 무한 스크롤, Tailwind CSS</sub>
</p>

---

## ✨ 데모

> <img src="https://user-images.githubusercontent.com/9510055/273370282-2e2e6b2e-2e2e-4e2e-8e2e-2e2e6b2e2e2e.gif" width="600" alt="Demo" />

---

## 🛠️ 주요 기능

- **커서 기반 페이징**: createdAt DESC, nextCursor, hasMore
- **무한 스크롤**: IntersectionObserver + useSWRInfinite
- **회원가입/로그인**: JWT 인증, bcrypt 해싱
- **실시간 게시물 작성**: 로그인 후 즉시 반영
- **최신순 정렬**: 항상 최신 게시물이 위에
- **Prisma ORM**: DB 추상화, 관계형 모델
- **Tailwind CSS**: 반응형 UI

---

## 🧑‍💻 기술 스택

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (Prisma ORM, 쉽게 MySQL/PostgreSQL로 변경 가능)
- **Data Fetching**: SWR (useSWRInfinite)
- **Auth**: JWT, bcryptjs

---

## ⚡ 빠른 시작

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.example .env
# 또는 직접 .env 파일 생성 후 DATABASE_URL, JWT_SECRET 입력

# 3. DB 스키마 적용
npm run db:generate
npm run db:push

# 4. 개발 서버 실행
npm run dev
```

---

## 📁 폴더 구조

```
js-sns/
├── app/                # Next.js App Router
│   ├── api/             # API 라우트 (회원가입, 로그인, 피드)
│   ├── components/      # UI 컴포넌트
│   ├── hooks/           # 커스텀 훅
│   └── page.tsx         # 메인 페이지
├── prisma/              # Prisma 스키마 및 DB
├── lib/                 # 인증 유틸리티
├── types/               # 타입 정의
├── public/              # 정적 파일
├── .env                 # 환경 변수
├── .gitignore           # Git Ignore
└── README.md            # 프로젝트 설명
```

---

## 🔄 커서 기반 페이징 설명

- **쿼리**: `createdAt` DESC, `limit + 1`개 조회
- **응답**: `posts`, `nextCursor`, `hasMore`
- **다음 페이지**: `nextCursor`를 쿼리 파라미터로 전달
- **마지막 페이지**: `hasMore: false`, `nextCursor: null`
- **장점**: 오프셋 기반보다 빠르고, 중복/누락 없이 일관성 유지

---

## 🧩 기여 방법

1. 이 저장소를 fork 합니다
2. 새 브랜치 생성 (`git checkout -b feature/새기능`)
3. 커밋 후 푸시 (`git commit -m 'Add 새기능' && git push origin feature/새기능`)
4. Pull Request 생성

---

## 📝 라이선스

이 프로젝트는 [MIT License](LICENSE)를 따릅니다.

---

## 🙏 Special Thanks

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [SWR](https://swr.vercel.app/)
- [Tailwind CSS](https://tailwindcss.com/)

---

> Made with ❤️ by Junseong 