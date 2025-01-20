import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/app/lib/prisma";

export const handler = NextAuth({
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

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
    // Kakao
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    // Naver
    Naver({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
    // Google
    // Google({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
  ],

  // 🎈 accessToken Session에서 과리하기 위함
  callbacks: {
    // jwt에서 user 정보(accessToken 포함)가 token으로 덮어씌우게 된다. 여기서 user는 undefined
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    // 이후 jwt의 token이 인자로 들어가고 해당 session은 sessionStorage에 저장된 값 들고옴
    // 즉 session.user.accessToken으로 전역으로 토큰을 사용할 수 있다.
    // 토큰 사용은 const { data: session } = useSession(); 통해서 가져올 수 있다.
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
  // 🎈 User 정보를 확인하여 없으면 추가 있으면 넘어감
  //    하지만 소셜 로그인에 이메일을 제공하지 않으면 로그인이 되지 않음
  // callbacks: {
  //   // JWT 콜백
  //   async jwt({ token, user }) {
  //     // 로그인한 유저가 처음이면 DB에 저장
  //     if (user) {
  //       const existingUser = await prisma.user.findUnique({
  //         where: {
  //           email: user.email!,
  //         },
  //       });

  //       if (!existingUser) {
  //         // 새 유저이면 DB에 저장
  //         await prisma.user.create({
  //           data: {
  //             email: user.email!,
  //             name: user.name!,
  //             password: "", // 비밀번호는 소셜 로그인일 경우 빈값
  //           },
  //         });
  //       }
  //     }

  //     // JWT 토큰에 사용자 정보 추가
  //     return { ...token, ...user };
  //   },

  //   // 세션 콜백
  //   async session({ session, token }) {
  //     session.user = token as any; // 세션에 토큰 정보 저장
  //     return session;
  //   },
  // },

  // // 세션 옵션
  // session: {
  //   strategy: "jwt", // JWT 방식으로 세션 관리
  // },

  // 커스텀 로그인 페이지 url으로 이동시 추가 or 로그인 필요 페이지 접속 시 이동
  pages: {
    signIn: "/signin", // 커스텀 로그인 페이지 경로
  },
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
