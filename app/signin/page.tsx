"use client";
import React, { useRef, useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";

function Login() {
  // getProviders() 함수는 Providers(제공자)의 정보를 가져온다.
  // 해당 함수를 실행을 하면 객체형식의 providers의 정보를 가져오고
  // map 함수를 통해 signIn() 함수 안에 providers.id를 통해 등록한 providers의 기능을 사용한다.

  // 🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈 예시 🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈
  // {
  //   "google": {
  //     "id": "google",
  //     "name": "Google",
  //     "type": "oauth",
  //     "signinUrl": "/api/auth/signin/google",
  //     "callbackUrl": "/api/auth/callback/google"
  //   },
  //   "github": {
  //     "id": "github",
  //     "name": "GitHub",
  //     "type": "oauth",
  //     "signinUrl": "/api/auth/signin/github",
  //     "callbackUrl": "/api/auth/callback/github"
  //   }
  // }
  // 🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈

  // 카카오 로그인 첫 번째 방법 - getProviders() 통해 가져온 객체를 map 함수로 전부 뿌리기
  // const [providers, setProviders] = useState(null);

  // useEffect(() => {
  //   (async () => {
  //     // getProviders() 함수는 유틸리티 함수이다.
  //     const res: any = await getProviders();
  //     console.log(res);
  //     setProviders(res);
  //   })();
  // }, []);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async () => {
    // console.log(emailRef.current);
    // console.log(passwordRef.current);
    const result = await signIn("credentials", {
      username: emailRef.current,
      password: passwordRef.current,
      redirect: true,
      callbackUrl: "/",
    });
  };

  // 카카오 로그인 두 번째 방법 - 비동기 함수 사용
  // const handleKakao = async () => {
  //   const result = await signIn("kakao", {
  //     redirect: true,
  //     callbackUrl: "/",
  //   });
  // };

  return (
    <main className="flex min-h-screen flex-col items-center space-y-10 p-24">
      <h1 className="text-4xl font-semibold">Login</h1>
      <div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm text-gray-800 dark:text-gray-200"
          >
            Email
          </label>

          <div className="mt-1">
            <input
              ref={emailRef}
              onChange={(e: any) => {
                emailRef.current = e.target.value;
              }}
              id="email"
              name="email"
              type="email"
              required
              autoFocus={true}
              className="mt-2 block w-full rounded-md border bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-300"
            />
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="password"
            className="block text-sm text-gray-800 dark:text-gray-200"
          >
            Password
          </label>
          <div className="mt-1">
            <input
              type="password"
              id="password"
              name="password"
              ref={passwordRef}
              onChange={(e: any) => (passwordRef.current = e.target.value)}
              className="mt-2 block w-full rounded-md border bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-300"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="w-full transform rounded-md bg-gray-700 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
          >
            Log In
          </button>
        </div>
      </div>

      <div>
        {/* Kakao */}
        <button
          className="w-full transform rounded-md bg-gray-700 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
          onClick={() => signIn("kakao", { redirect: true, callbackUrl: "/" })}
        >
          kakao login
        </button>
        {/* Naver */}
        <button
          className="w-full transform rounded-md bg-gray-700 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
          onClick={() => signIn("naver", { redirect: true, callbackUrl: "/" })}
        >
          naver login
        </button>
      </div>
    </main>
  );
}

export default Login;
