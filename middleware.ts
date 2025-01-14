// yarn add next@canary를 통해 미들웨어를 설치
// 이는 일반적인 페이지를 미들웨어를 통해 로그인이 필요한 즉 로그인을 하지 않으면
// 해당 페이지로 접근하지 못하게 할 수 있다.

export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/userposts/:path*"],
};

// 해당 /userposts 경로로 시작하는 모든 페이지는 보호할 수 있다.
// 즉 /userposts,  /userposts/123 등등 로그인을 통해서만 접근을 할 수 있다.
