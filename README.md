25.01.13 <br>
CredentialsProvider를 통한 로그인 구현 <br>
prisma를 통한 테스트 회원가입 및 로그인 처리 <br>

25.01.14 <br>
accessToken 발급 및 세션 쿠키 저장 <br>
로그인 필요한 사이트 접근 권한 미들웨어를 통해 보안 <br>

25.01.15 <br>
카카오 소셜 로그인 추가 <br>
로그인 페이지 카카오 로그인 버튼 추가 <br>

25.01.16 <br>
네이버 소셜 로그인 추가 <br>
ssr을 통해 session 정보 가져옴 <br>

로그인 시 session 정보를 useSession() 함수를 통해 가져왔으나 네임 또는 로그아웃 버튼 변경에 텀이 생김 <br>
이는 useSession()함수가 클라이언트에서만 동작을 해 생긴 문제이다. <br>
2가지 방법으로 해결을 할 수 있다. <br>

>첫 번째 <br>

useSession() 함수의 state 옵션을 통해 session의 상태를 추적할 수 있다. <br>
로그인 후 session의 정보가 들어올 때 까지 "loading" 상태여서 다음과 같이 사용했다. <br>
```bash
const { data: session, status } = useSession();

if (status === "loading") {
  return <div>loading...</div>;
}
```
로그인을 하면 loading 띄우다 session에 정보가 들어가면 유저 프로필 또는 로그아웃 버튼으로 변경이 된다. <br>


>두 번째 <br>

루트 페이지는 서버 컴포넌트로 서버에서 NextAuth에 지원하는 getServerSession(handler) 함수를 사용하면 서버 사이드에서 유저 정보를 가져올 수 있다. <br>
```bash
const session: Session | null = await getServerSession(handler);

<SignInButton session={session} />
```
ssr로 데이터를 가져와 클라이언트 컴포넌트에 Props로 넘겨준다. <br>
layout 헤더에 사용하려면 layout.tsx에 똑같이 해주면 된다. <br>

25.01.20 <br>
메인페이지 변경 <br>

>이미지 <br>

![nextAuth01](https://github.com/user-attachments/assets/1666dacc-8f0c-41c9-be5f-cb85ab4085e4) <br>
![nextAuth02](https://github.com/user-attachments/assets/7f390c1f-c721-444c-9a54-11b4353be669) <br>


>app/page.tsx - 메인 페이지 <br>

```bash
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
```



