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

  // user가 존재한지 확인을 하고
  // body.password로 사용자가 입력한 pw와 user.password로 저장된 pw를 비교한다.
  // 여기서 bcrypt.compare를 통해 암호화된 비밀번호를 비교한다.
  if (user && (await bcrypt.compare(body.password, user.password))) {
    // 구조분해 할당으로 password 제외 user 값을 userWithoutPass에 할당
    const { password, ...userWithoutPass } = user;
    return new Response(JSON.stringify(userWithoutPass));
  } else return new Response(JSON.stringify(null));
}

// bcrypt 라이브러리를 통해 비밀번호 해쉬 처리
// REST API와 유사함 [...nextauth]에서 authorize 함수의 fetch를 보면
// `${process.env.NEXTAUTH_URL}/api/login`으로 해당 주소로 fetch API 요청을 하는데
// 해당 경로에 로그인 API가 있다.
