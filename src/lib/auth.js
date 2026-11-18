import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback-secret-key-min-32-chars-long'
);

// Creating JWT Token
export async function createSessionToken(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h') // The token will be valid for 2 hours
        .sign(SECRET_KEY);
}

// Verifying JWT Token
export async function verifySessionToken(token) {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch (error) {
        return null; // If the token is invalid or expired
    }
}