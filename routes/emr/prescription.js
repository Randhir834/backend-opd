import connectDB from "../../lib/db.js";
import Prescription from "../../models/Prescription.js";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "POST") {
        try {
            const prescription = new Prescription(req.body);
            await prescription.save();
            return res.status(201).json(prescription);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
