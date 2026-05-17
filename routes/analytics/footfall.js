import connectDB from "../../lib/db.js";
import Patient from "../../models/Patient.js";
import Appointment from "../../models/Appointment.js";

export default async function handler(req, res) {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    await connectDB();

    try {
        const { date } = req.query;
        let queryDate = date ? new Date(date) : new Date();
        
        let startOfDay = new Date(queryDate);
        startOfDay.setHours(0, 0, 0, 0);
        let endOfDay = new Date(queryDate);
        endOfDay.setHours(23, 59, 59, 999);

        const dateRangeFilter = {
            creationDate: { $gte: startOfDay, $lte: endOfDay }
        };

        // Total OPD Registrations today
        const opdRegistrations = await Patient.countDocuments(dateRangeFilter);

        // Appointments today
        const appointmentsToday = await Appointment.countDocuments({
            appointmentDate: { $gte: startOfDay, $lte: endOfDay }
        });

        // Group patients by department (using string aggregation if department field exists)
        const patientByDepartment = await Patient.aggregate([
            { $match: dateRangeFilter },
            { $group: { _id: "$department", count: { $sum: 1 } } }
        ]);

        return res.status(200).json({
            date: startOfDay.toISOString().split('T')[0],
            footfall: {
                totalRegistrations: opdRegistrations,
                scheduledAppointments: appointmentsToday,
                byDepartment: patientByDepartment.map(d => ({ department: d._id || "General", count: d.count }))
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
