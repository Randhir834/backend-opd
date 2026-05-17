import connectDB from "../lib/db.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "GET") {
        try {
            // Fetch all patients and doctors
            const patients = await Patient.find().populate("doctor");
            const doctors = await Doctor.find();

            // Calculate counts
            const patientCount = patients.length;
            const doctorCount = doctors.length;

            // Calculate total earnings for today
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const totalEarningsToday = patients.reduce((sum, patient) => {
                const patientDate = new Date(patient.createdAt); // Use the createdAt timestamp
                if (patientDate >= today && patientDate < tomorrow) {
                    return sum + patient.finalFee;
                }
                return sum;
            }, 0);

            res.status(200).json({
                patientCount,
                doctorCount,
                totalEarningsToday,
            });
        } catch (error) {
            console.error("Error fetching admin dashboard data:", error);
            res.status(500).json({ error: "Failed to fetch data" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}