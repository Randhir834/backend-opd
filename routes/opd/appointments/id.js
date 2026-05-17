import connectDB from "../../../lib/db.js";
import Appointment from "../../../models/Appointment.js";

export default async function handler(req, res) {
    await connectDB();

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Appointment ID required" });

    if (req.method === "GET") {
        try {
            const appt = await Appointment.findById(id)
                .populate("patient", "name contact opdNumber age gender")
                .populate("doctor", "name department");
            if (!appt) return res.status(404).json({ error: "Appointment not found" });
            return res.status(200).json(appt);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === "PUT") {
        try {
            const appt = await Appointment.findByIdAndUpdate(id, req.body, { new: true })
                .populate("patient", "name contact opdNumber age gender")
                .populate("doctor", "name department");
            if (!appt) return res.status(404).json({ error: "Appointment not found" });
            return res.status(200).json(appt);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    if (req.method === "DELETE") {
        try {
            const appt = await Appointment.findByIdAndDelete(id);
            if (!appt) return res.status(404).json({ error: "Appointment not found" });
            return res.status(200).json({ message: "Appointment deleted" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
