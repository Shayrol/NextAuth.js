// 회원가입 API

import prisma from "@/app/lib/prisma";
import * as bcrypt from "bcrypt";

interface RequestBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  const body: RequestBody = await request.json();

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: await bcrypt.hash(body.password, 10),
    },
  });

  const { password, ...result } = user;
  return new Response(JSON.stringify(result));
}

// app router 은 API 파일을 route.ts 로 지어야 한다.
// prisma는 lib/prisma 객체에서 가져오고 있다.
// POST로 body를 받아오는데 request.json() 형식으로 body 부분을 추출할 수 있다.
// 여기서 추가한 비밀번호를 그대로 저장을 하면 안된다.
// 그래서 bcrypt.hash의 라이브러리를 통해 해쉬한 후 저장을 한다.

// prisma는 graphql와 같은 다른 백엔드 사용시 필요하지 않지만 같이 사용하면 좋다는데...
// 일단 prisma.user.create의 회원가입에 사용되지 않고 해당 api 요청 함수가 사용된다.
