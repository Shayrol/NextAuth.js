// 미들웨어를 통해 해당 /userposts로 시작하는 경로는 로그인을 통해 접근할 수 있다.
// next_auth/middleware.ts 파일을 통해 설정

function UserPosts() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      UserPosts
    </main>
  );
}

export default UserPosts;

// 로그인이 되어있지 않으면 로그인 페이지로 이동하며, 로그인 후 접속하려는 페이지로 이동
