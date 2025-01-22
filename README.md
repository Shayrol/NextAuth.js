# 25.01.13 <br>
CredentialsProvider를 통한 로그인 구현 <br>
prisma를 통한 테스트 회원가입 및 로그인 처리 <br>

# 25.01.14 <br>
accessToken 발급 및 세션 쿠키 저장 <br>
로그인 필요한 사이트 접근 권한 미들웨어를 통해 보안 <br>

# 25.01.15 <br>
카카오 소셜 로그인 추가 <br>
로그인 페이지 카카오 로그인 버튼 추가 <br>

# 25.01.16 <br>
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

# 25.01.20 <br>
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

# 25.01.20 <br>
accessToken, refreshToken 관리 <br>

백엔드 서버에서 accessToken, refreshToken을 발급한 경우에 대해 /app/api/auth/[...nextauth]/설명.txt 에 적었다. <br>

>accessToken

로그인 방법 2가지로 회원가입을 통한 로그인방식(CredentialsProvider)와 소셜 로그인 방식이 있다.<br>

# CredentialsProvider 기준
1. 로그인을 하면 서버에서 accessToken과 refreshToken을 발급 받는데 accessToken을 반환 하지만 refreshToken은 쿠키의 httpOnly, secure를 통해 보안을 강화하여 쿠키에 저장을 한다. <br>
2. 이후 callbacks의 jwt 콜백에 해당 accesToken을 token에 추가를 하고 return하며, session 콜백에 저장을 한다. <br>
3. 사용자 인증이 필요한 API 요청은 headers의 Authorization: `Bearer ${session.accessToken}`, 을 통해 요청하면 된다.
```bash
const response = await fetch("YOUR_BACKEND/endpoint", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.accessToken}`, // Authorization 헤더에 accessToken 추가
  },
});
```
4. sessionToken이 만료가 되면 jwt 콜백을 실행을 하며 여기서 refreshToken() 함수를 실행을 하는데 다음과 같다.
```bash
const response = await fetch('/api/refresh-token', {
  method: 'POST',
  credentials: 'include', // 쿠키 포함
});
```
이는 credentials: 'include'를 통해 쿠키에 있는 refreshToken 값을 포함해 서버에 넘겨줄 수 있다. <br>
이후 받아온 response의 accessToken을 다시 jwt 콜백의 token에 저장을 하고 session 콜백에 넣어 수정해주면 된다. <br>

# refreshToken 만료 시
해당 refreshToken 만료 시 백엔드에서는 요청 거부로 401 Unauthorized 에러 응답이 오는데 이를 통해 로그아웃 처리 해주면 된다. <br>
```bash
const refreshAccessToken = async () => {
  try {
    const response = await fetch("YOUR_BACKEND/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Refresh Token 만료
        handleLogout(); // 로그아웃 함수 호출
      }
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    return data.accessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    handleLogout(); // 네트워크 문제 등으로 실패 시 로그아웃
  }
};
```
refreshToken()함수 호출 후 401 반환하면 로그아웃 함수를 호출 한다. <br>

# GoogleProvider 기준
1. 과정은 동일한데 소셜 토큰을 전달 후 서버에서 생성된 accessToken과 refreshToken을 받는다.
```bash
GoogleProvider({
  clientId: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      // account에는 소셜 플랫폼의 access_token이 있습니다
      // 백엔드로 소셜 토큰 전달
      const response = await fetch('YOUR_BACKEND/social-login', {
        method: 'POST',
        body: JSON.stringify({
          provider: 'google',
          token: account.access_token,
          profile: profile
        })
      });

      const data = await response.json();
      // 백엔드에서 자체 accessToken을 발급받음
      account.backendAccessToken = data.accessToken;
      
      return true;
    }
  }
})
```
백엔드에서 정의한 방식으로 provider, token, profile을 body에 담아 요청을 하고 accessToken, refreshToken을 발급받는다. <br>
여기서 signIn의 account는 소셜 토큰을 의미하고 profile은 해당 유저에 대한 정보가 포함되어있다.


