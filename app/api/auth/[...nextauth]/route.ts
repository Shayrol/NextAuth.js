// import NextAuth from "next-auth";
// import Github from "next-auth/providers/github";

// export const authOptions = {
//   providers: [
//     Github({
//       clientId: process.env.GITHUB_ID ?? "",
//       clientSecret: process.env.GITHUB_SECRET ?? "",
//     }),
//   ],
// };

// export default NextAuth(authOptions);

import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "이메일",
          type: "text",
          placeholder: "이메일 주소 입력",
        },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });
        const user = await res.json();
        console.log(user);

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
    // Google 로그인 추가 시 아래 Provider 추가
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
  ],
  // 커스텀 로그인 페이지 url으로 이동시 추가
  // pages: {
  //   signIn: "/custom-login", // 커스텀 로그인 페이지 경로
  // },
});

export { handler as GET, handler as POST };

// 로그인 버튼 즉 signIn() 함수가 실행을 하면 http://localhost:3000/api/auth/signin 해당 주소로 이동을 함
// 해당 주소는 NextAuth에 기본으로 제공하는 로그인 페이지이다.

// 커스텀 로그인 페이지 사용시 해당 pages 만 추가 해주면 된다.
// username, password 의 값은 로그인 페이지의 signIn() 함수를 통해 값과 Provider의 이름만
// 명시해 주면 된다.
// 예) 로그인 페이지 이메일, 비번 입력 후 버튼 클릭 시
// await signIn("credentials", {
//   redirect: false, // 리다이렉트를 방지 (원하는 경우 사용)
//   username: email, // 인풋 값 전달
//   password: password, // 인풋 값 전달
// });
