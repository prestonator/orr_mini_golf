import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET || 'fallback_secret_for_local_dev');

export async function createSessionToken(profileId: string) {
  const token = await new SignJWT({ sub: profileId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
  return token;
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
}
