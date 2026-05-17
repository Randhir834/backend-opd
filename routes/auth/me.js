import connectDB from "../../lib/db.js";
import User from "../../models/User.js";
import Doctor from "../../models/Doctor.js";
import { requireAuth } from "../../lib/auth.js";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const decoded = requireAuth(req);
        await connectDB();

        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        let doctorProfile = null;
        if (user.isDoctor) {
            doctorProfile = await Doctor.findOne({ userId: user._id });
        }

        return res.status(200).json({
            id: user._id,
            username: user.username,
            name: user.name || user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            isDoctor: user.isDoctor,
            department: doctorProfile?.department || user.department || "",
            specialization: user.specialization || "",
            doctorId: doctorProfile?._id || null,
        });
    } catch (err) {
        return res.status(err.statusCode || 401).json({ message: err.message });
    }
}
