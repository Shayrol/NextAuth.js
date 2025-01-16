"use client";

import { useRouter } from "next/navigation";

function PostButton() {
  const router = useRouter();

  const onClickPostsPage = (): void => {
    void router.push("/userposts");
  };

  return <button onClick={onClickPostsPage}>게시물 페이지 이동</button>;
}

export default PostButton;
