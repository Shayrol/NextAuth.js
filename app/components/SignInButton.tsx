"use client";
import { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

interface ISessionProps {
  session: Session | null;
}

// 해당 session은 ssr로 받아와 가져온 값
function SignInButton({ session }: ISessionProps) {
  // 아래 useSession()은 csr로 session 정보를 불러올 때 사용
  // const { data: session, status } = useSession();

  // console.log("session: ", session);

  // if (status === "loading") {
  //   return <div>loading...</div>;
  // }

  if (session && session.user) {
    return (
      <button
        className="py-1 max-w-[300px] w-full border rounded-xl bg-red-300 text-[12px]"
        onClick={() => signOut()}
      >
        {session.user.name}님 로그아웃
      </button>
    );
  }

  return (
    <button
      className="py-1 max-w-[300px] w-full border rounded-xl bg-yellow-300 text-[12px]"
      onClick={() => signIn()}
    >
      로그인
    </button>
  );
}

export default SignInButton;

// signIn과 signOut은 next-auth에 제공하며 세션 생성 및 삭제로 로그인, 로그아웃을 함

// useSession은 앞서 layout의 SessionProvider의 정보를 불러와 로그인한 정보를 가져옴
// 로그아웃 상태면 null을 반환
