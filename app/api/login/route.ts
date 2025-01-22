// 로그인 API

// import { signJwtAccessToken } from "@/app/lib/jwt";
// import prisma from "@/app/lib/prisma";
// import * as bcrypt from "bcrypt";

// interface RequestBody {
//   username: string | undefined;
//   password: string;
// }

// export async function POST(request: Request) {
//   const body: RequestBody = await request.json();

//   // prisma DB에 user가 있는지 확인
//   const user = await prisma.user.findFirst({
//     where: {
//       email: body.username,
//     },
//   });

//   // user가 존재한지 확인을 하고
//   // body.password로 사용자가 입력한 pw와 user.password로 저장된 pw를 비교한다.
//   // 여기서 bcrypt.compare를 통해 암호화된 비밀번호를 비교한다.
//   if (
//     user &&
//     body.password &&
//     (await bcrypt.compare(body.password, String(user.password)))
//   ) {
//     const { password, ...userWithoutPass } = user;

//     const accessToken = signJwtAccessToken(userWithoutPass);
//     const result = {
//       ...userWithoutPass,
//       accessToken,
//     };

//     return new Response(JSON.stringify(result));
//   } else {
//     return new Response(JSON.stringify(null));
//   }
// }

// bcrypt 라이브러리를 통해 비밀번호 해쉬 처리
// REST API와 유사함 [...nextauth]에서 authorize 함수의 fetch를 보면
// `${process.env.NEXTAUTH_URL}/api/login`으로 해당 주소로 fetch API 요청을 하는데
// 해당 경로에 로그인 API가 있다.

import { signJwtAccessToken } from "@/app/lib/jwt";
import prisma from "@/app/lib/prisma";
import * as bcrypt from "bcrypt";

interface RequestBody {
  username?: string;
  password?: string | null;
  social?: {
    provider: string;
    email: string;
  };
}

async function createAccessToken(user: any) {
  const { password, ...userWithoutPass } = user; // password 제외
  const accessToken = signJwtAccessToken(userWithoutPass); // JWT 생성
  return {
    ...userWithoutPass,
    accessToken,
  };
}

export async function POST(request: Request) {
  const body: RequestBody = await request.json();

  // 2. 일반 로그인 처리
  if (body.username && body.password) {
    const user = await prisma.user.findFirst({
      where: { email: body.username },
    });

    if (user && (await bcrypt.compare(body.password, String(user.password)))) {
      const result = await createAccessToken(user);
      return new Response(JSON.stringify(result));
    }
  }

  // 3. 소셜 로그인 처리
  if (body.social) {
    const { provider, email } = body.social;

    let user = await prisma.user.findFirst({
      where: { email },
    });

    // 소셜 로그인의 경우 DB에 없는 사용자라면 새로 생성
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: `SocialUser-${provider}`, // 기본값 설정
          provider,
        },
      });
    }

    const result = await createAccessToken(user);
    return new Response(JSON.stringify(result));
  }

  return new Response(JSON.stringify({ error: "Invalid credentials" }), {
    status: 401,
  });
}
