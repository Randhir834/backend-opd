// routes/encounters.js
import connectDB from "../lib/db.js";
import Encounter from "../models/Encounter.js";
import { requireAuth } from "../lib/auth.js";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "POST") {
        try {
            const user = requireAuth(req);
            const encounter = new Encounter({
                ...req.body,
                doctorId: req.body.doctorId || user?.id,
            });
            await encounter.save();
            res.status(201).json(encounter);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    } else if (req.method === "GET") {
        try {
            const { patientId } = req.query;
            const filter = patientId ? { patientId } : {};
            const encounters = await Encounter.find(filter).sort({ visitDate: -1 });
            res.status(200).json(encounters);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
