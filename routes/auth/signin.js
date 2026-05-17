import connectDB from "../../lib/db.js";
import User from "../../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import dotenv from "dotenv";

// Load env vars in case this file is loaded standalone
dotenv.config({ path: ".env" });

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    await connectDB();

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Missing fields" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, isAdmin: user.isAdmin, isDoctor: user.isDoctor },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.setHeader(
            "Set-Cookie",
            serialize("_vercel_jwt", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                maxAge: 3600,
                sameSite: "strict",
                path: "/",
            })
        );

        res.status(200).json({ message: "Sign in successful", isAdmin: user.isAdmin, isDoctor: user.isDoctor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
