import connectDB from "../../../lib/db.js";
import Patient from "../../../models/Patient.js";
import Encounter from "../../../models/Encounter.js";
import Appointment from "../../../models/Appointment.js";

export default async function handler(req, res) {
    await connectDB();
    const { id } = req.query;

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const patient = await Patient.findById(id).populate("doctor", "name department contact consultationFee");
        if (!patient) return res.status(404).json({ error: "Patient not found" });

        // All OPD encounters sorted newest first
        const encounters = await Encounter.find({ patientId: id })
            .sort({ visitDate: -1 })
            .lean();

        // All appointments sorted newest first
        const appointments = await Appointment.find({ patient: id })
            .populate("doctor", "name department")
            .sort({ appointmentDate: -1 })
            .lean();

        return res.status(200).json({ patient, encounters, appointments });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
