"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

function PostButton() {
  const router = useRouter();

  return (
    <div className="h-full">
      <Link
        href={"/userposts"}
        className="border border-gray-300 hover:bg-black hover:text-white transition-all duration-200 rounded-sm px-[3px] py-[2px] text-[12px]"
      >
        게시물 페이지
      </Link>
      <p className="text-[9px] mt-[5px]">
        해당 게시물 페이지는{" "}
        <span className="text-red-500 font-bold">로그인 후</span> 이용 가능한
        페이지 입니다.
      </p>
      <p className="text-[9px]">
        middleware를 통해 /userposts로 시작하는 모든 페이지 접속에 로그인 인증이
        필요하며,
      </p>
      <p className="text-[9px]">
        로그인을 하지 않고 접속 시 NextAuth의 pages에 설정한 로그인 페이지로
        이동 됩니다.
      </p>
    </div>
  );
}

export default PostButton;
