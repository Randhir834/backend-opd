import connectDB from "../../lib/db.js";
import Patient from "../../models/Patient.js";
import Doctor from "../../models/Doctor.js";

export default async function handler(req, res) {
    await connectDB();

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Patient ID required" });

    if (req.method === "GET") {
        try {
            const patient = await Patient.findById(id).populate("doctor");
            if (!patient) return res.status(404).json({ error: "Patient not found" });
            return res.status(200).json(patient);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === "PUT") {
        try {
            const patient = await Patient.findByIdAndUpdate(id, req.body, { new: true }).populate("doctor");
            if (!patient) return res.status(404).json({ error: "Patient not found" });
            return res.status(200).json(patient);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    if (req.method === "DELETE") {
        try {
            const patient = await Patient.findByIdAndDelete(id);
            if (!patient) return res.status(404).json({ error: "Patient not found" });
            return res.status(200).json({ message: "Patient deleted" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
