// pages/api/auth/signup.js
import connectDB from "../../lib/db.js";
import User from "../../models/User.js";
import Doctor from "../../models/Doctor.js";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
    await connectDB();

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { username, name, email, phone, password, isAdmin, isDoctor, department, specialization, consultationFee } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Missing fields" });
    }

    try {
        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }] 
        });
        if (existingUser) {
            return res.status(400).json({ message: "User or email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ 
            username, 
            name: name || username,
            email, 
            phone: phone || "",
            password: hashedPassword, 
            isAdmin: isAdmin || false,
            isDoctor: isDoctor || false,
            department: department || "",
            specialization: specialization || ""
        });
        await user.save();

        if (isDoctor) {
            const existingDoctor = await Doctor.findOne({ userId: user._id });
            if (!existingDoctor) {
                const doctor = new Doctor({
                    userId: user._id,
                    name: name || username,
                    department: department || "",
                    contact: phone || "",
                    consultationFee: typeof consultationFee === "number" ? consultationFee : 0,
                });
                await doctor.save();
            }
        }
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
