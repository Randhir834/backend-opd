import jwt from "jsonwebtoken";

const COOKIE_NAME = "_vercel_jwt";

export function getTokenFromRequest(req) {
    const header = req.headers?.authorization || req.headers?.Authorization;
    if (header && typeof header === "string" && header.toLowerCase().startsWith("bearer ")) {
        return header.slice(7).trim();
    }

    const cookieHeader = req.headers?.cookie;
    if (!cookieHeader) return null;

    const match = cookieHeader.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`));
    return match ? decodeURIComponent(match[1]) : null;
}

export function requireAuth(req) {
    const token = getTokenFromRequest(req);
    if (!token) {
        const err = new Error("Unauthorized");
        err.statusCode = 401;
        throw err;
    }

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        const err = new Error("Invalid token");
        err.statusCode = 401;
        throw err;
    }
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
