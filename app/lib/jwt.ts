// jwt 토큰 생성 - api/login 로그인 로직에 accessToken 추가

import jwt, { JwtPayload } from "jsonwebtoken";

interface SignOption {
  expiresIn?: string | number;
}

const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: "1h",
};

export function signJwtAccessToken(
  payload: JwtPayload, // JWT 토큰에 담길 사용자 정보 (api/login의 userWithoutPass와 동일)
  options: SignOption = DEFAULT_SIGN_OPTION // JWT 옵션 (1시간 유효)
) {
  const secret_key = process.env.SECRET_KEY;
  const token = jwt.sign(payload, secret_key!, options); // JWT 토큰 생성
  return token;
}

// token 정확한지 체크
export function verifyJwt(token: string) {
  try {
    const secret_key = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, secret_key!);
    return decoded as JwtPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
}
