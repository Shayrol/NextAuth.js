// 로그인 API

import prisma from "@/app/lib/prisma";
import * as bcrypt from "bcrypt";

interface RequestBody {
  username: string;
  password: string;
}

export async function POST(request: Request) {
  const body: RequestBody = await request.json();

  const user = await prisma.user.findFirst({
    where: {
      email: body.username,
    },
  });

  if (user && (await bcrypt.compare(body.password, user.password))) {
    const { password, ...userWithoutPass } = user;
    return new Response(JSON.stringify(userWithoutPass));
  } else return new Response(JSON.stringify(null));
}

// bcrypt 라이브러리를 통해 비밀번호 해쉬 처리
// REST API와 유사함 [...nextauth]에서 authorize 함수의 fetch를 보면
// `${process.env.NEXTAUTH_URL}/api/login`으로 해당 주소로 fetch API 요청을 하는데
// 해당 경로에 로그인 API가 있다.
