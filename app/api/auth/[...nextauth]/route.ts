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
          social: {
            provider: "credentials",
          },
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
  // callbacks: {
  //   // jwt에서 user 정보(accessToken 포함)가 token으로 덮어씌우게 된다. 여기서 user는 undefined
  //   async jwt({ token, user }) {
  //     return { ...token, ...user };
  //   },
  //   // 이후 jwt의 token이 인자로 들어가고 해당 session은 sessionStorage에 저장된 값 들고옴
  //   // 즉 session.user.accessToken으로 전역으로 토큰을 사용할 수 있다.
  //   // 토큰 사용은 const { data: session } = useSession(); 통해서 가져올 수 있다.
  //   async session({ session, token }) {
  //     session.user = token as any;
  //     return session;
  //   },
  // },

  callbacks: {
    async jwt({ token, user, account }) {
      // 소셜 로그인인 경우 user와 account가 제공됩니다.
      if (account && user) {
        const existingUser = await prisma.user.findUnique({
          where: { email: String(user.email) },
        });

        if (!existingUser) {
          // 소셜 로그인으로 처음 로그인한 사용자 -> DB에 새 사용자 생성
          await prisma.user.create({
            data: {
              email: String(user.email),
              name: user.name || "", // 소셜 제공자에서 이름을 제공하지 않을 수도 있음
              provider: account.provider, // 로그인 제공자 정보 저장
              providerId: account.providerAccountId || null,
            },
          });
        }
      }

      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },

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

// 개인 로그인과 소셜 로그인에 대한 설명
// 1. 개인 로그인 같은 경우에는 user에 대한 데이터가 없어 로그인 함수를 통해 생성을 해줘야 한다.
//    이후 로그인 함수에 accessToken을 생성하는 signJwtAccessToken()함수 라이브러리를 사용을
//    했는데 이를 callbacks의 jwt()함수 마지막에 호출을 하고 user에 추가를 한다.
//    그럼 ...token에 덮어 씌우게 되며, 이후 session() 함수의 token 인자에 들어간다.
// 2. token의 값을 session.user에 저장을 하고 session을 리턴한다.

// 3. 소셜 로그인은 user와 account 값이 주어진다. 여기서 user은 name, email, image 등이 있으며,
//    account는 해당 provider, providerAccountId, access_token(소셜 로그인에 대한 토큰) 등이
//    있다.
// 4. 소셜 로그인을 하고 jwt에 성공했는지 user, account 유무를 확인을 하고 있으면 DB에 계정이
//    있는지 확인을 한다.
//    없으면 DB에 추가를 하고 있으면 넘어가 signJwtAccessToken()함수를 호출해 accessToken을
//    발급받고 ...user를 업데이트 후 덮어 씌워 token을 생성을 하며, 위와같이 session이 저장한다.

// 클라이언트에서 signJwtAccessToken()함수의 accessToken을 호출을 하고 있는데 사실상 무의미한
// accessToken이다.
// NextAuth에서 jwt()콜백을 통해 생성한 JWT가 사실상 accessToken으로 사용하고 있다.
// 그래서 해당 JWT 만료 시간 계산 및 refetchToken()함수 생성
// 좀더 이 부분에 대해 찾아봐야 할 듯
