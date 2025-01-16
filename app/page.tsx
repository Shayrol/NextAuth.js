import { getServerSession, Session } from "next-auth";
import PostButton from "./components/PostsRouterButton";
import SignInButton from "./components/SignInButton";
import { handler } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  // 서버 컴포넌트 이므로 getServerSession() 함수를 통해 ssr 요청으로 로그인 정보를 불러온다.
  const session: Session | null = await getServerSession(handler);

  console.log("Home session: ", session);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-semibold">NextAuth Tutorial</h1>
      <PostButton />
      <SignInButton session={session} />
    </main>
  );
}

// 루트 페이지에 로그인 버튼 생성

// 실행
// yarn dev
// yarn prisma studio -> DB 웹을 통해 확인 시

// App Router는 getServerSideProps() 함수 없이 fetch와 같이 요청을 하면 ssr 요청이 이루어짐
// 단 서버 컴포넌트인 경우 가능
