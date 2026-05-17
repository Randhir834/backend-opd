// pages/api/doctors.js
import connectDB from "../lib/db.js";
import Doctor from "../models/Doctor.js";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "POST") {
        try {
            const doctor = new Doctor(req.body);
            await doctor.save();
            return res.status(201).json(doctor);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    } else if (req.method === "GET") {
        const doctors = await Doctor.find();
        return res.status(200).json(doctors);
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
