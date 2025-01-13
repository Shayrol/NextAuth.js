import SignInButton from "./components/SignInButton";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-semibold">NextAuth Tutorial</h1>
      <SignInButton />
    </main>
  );
}

// 루트 페이지에 로그인 버튼 생성

// 실행
// yarn dev
// yarn prisma studio -> DB 웹을 통해 확인 시
