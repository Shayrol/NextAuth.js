// userSession()을 통해 session.user. 에서 보면 accessToken이 안 잡히는 경우가 있다.
// 그래서 해당 경로 app폴더와 동일한 위치에 타입을 추가해주면 된다.

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
      accessToken: string;
    };
  }
}
