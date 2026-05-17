import cookie from "cookie";

export default function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    // Remove the authentication token
    res.setHeader(
        "Set-Cookie",
        cookie.serialize("_vercel_jwt", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            expires: new Date(0), // Expire immediately
            sameSite: "strict",
            path: "/",
        })
    );

    res.status(200).json({ message: "Logout successful" });
}
