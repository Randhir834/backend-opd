import connectDB from "../../lib/db.js";
import Appointment from "../../models/Appointment.js";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "POST") {
        try {
            const appointment = new Appointment(req.body);
            await appointment.save();
            return res.status(201).json(appointment);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    } else if (req.method === "GET") {
        try {
            const { date, doctorId } = req.query;
            let filter = {};
            if (date) {
                // If date provided, find appointments for that day
                const start = new Date(date);
                start.setHours(0, 0, 0, 0);
                const end = new Date(date);
                end.setHours(23, 59, 59, 999);
                filter.appointmentDate = { $gte: start, $lte: end };
            }
            if (doctorId) filter.doctor = doctorId;

            const appointments = await Appointment.find(filter)
                .populate('patient', 'name contact opdNumber')
                .populate('doctor', 'name department')
                .sort({ appointmentDate: 1 });
            return res.status(200).json(appointments);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
