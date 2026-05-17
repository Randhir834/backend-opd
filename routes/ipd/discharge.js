import connectDB from "../../lib/db.js";
import Admission from "../../models/Admission.js";
import Bed from "../../models/Bed.js";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "POST") {
        try {
            const { admissionId, extraCharges } = req.body;
            
            const admission = await Admission.findById(admissionId).populate('bed');
            if (!admission) return res.status(404).json({ error: "Admission not found" });
            if (admission.status === "Discharged") return res.status(400).json({ error: "Patient already discharged" });

            const dischargeDate = new Date();
            const timeDiff = Math.abs(dischargeDate.getTime() - new Date(admission.admittedAt).getTime());
            const daysStayed = Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1; // Minimum 1 day

            const bedCharges = daysStayed * admission.bed.pricePerDay;
            const totalBill = bedCharges + (extraCharges || 0);

            // Update Admission status
            admission.status = "Discharged";
            admission.dischargedAt = dischargeDate;
            admission.totalBill = totalBill;
            await admission.save();

            // Free the bed
            await Bed.findByIdAndUpdate(admission.bed._id, { isOccupied: false });

            return res.status(200).json({
                message: "Patient discharged successfully",
                details: {
                    daysStayed,
                    bedCharges,
                    extraCharges: extraCharges || 0,
                    totalBill
                }
            });
        } catch (error) {
             return res.status(400).json({ error: error.message });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
