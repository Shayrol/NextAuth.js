import { getServerSession, Session } from "next-auth";
import PostButton from "./components/PostsRouterButton";
import SignInButton from "./components/SignInButton";
import { handler } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  // 서버 컴포넌트 이므로 getServerSession() 함수를 통해 ssr 요청으로 로그인 정보를 불러온다.
  const session: Session | null = await getServerSession(handler);

  console.log("Home session: ", session);
  return (
    <main className="w-full h-screen flex flex-col justify-center items-center">
      <div className="border p-4 flex flex-col justify-between w-full max-w-[900px] h-screen">
        <h1 className="font-semibold">
          {session?.user?.name
            ? `${session.user.name}님 환영합니다.`
            : "로그인 필요합니다."}
        </h1>
        <PostButton />
        <div className="flex justify-center">
          <SignInButton session={session} />
        </div>
      </div>
    </main>
  );
}

// 루트 페이지에 로그인 버튼 생성

// 실행
// yarn dev
// yarn prisma studio -> DB 웹을 통해 확인 시

// App Router는 getServerSideProps() 함수 없이 fetch와 같이 요청을 하면 ssr 요청이 이루어짐
// 단 서버 컴포넌트인 경우 가능
