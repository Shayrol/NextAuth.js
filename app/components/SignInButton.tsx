"use client";
import { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

interface ISessionProps {
  session: Session | null;
}

function SignInButton({ session }: ISessionProps) {
  // const { data: session, status } = useSession();

  // console.log("session: ", session);

  // if (status === "loading") {
  //   return <div>loading...</div>;
  // }

  if (session && session.user) {
    return (
      <button
        className="px-12 py-4 border rounded-xl bg-red-300"
        onClick={() => signOut()}
      >
        {session.user.name}님 Log Out
      </button>
    );
  }

  return (
    <button
      className="px-12 py-4 border rounded-xl bg-yellow-300"
      onClick={() => signIn()}
    >
      LogIn
    </button>
  );
}

export default SignInButton;

// signIn과 signOut은 next-auth에 제공하며 세션 생성 및 삭제로 로그인, 로그아웃을 함

// useSession은 앞서 layout의 SessionProvider의 정보를 불러와 로그인한 정보를 가져옴
// 로그아웃 상태면 null을 반환
