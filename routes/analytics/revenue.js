import connectDB from "../../lib/db.js";
import Patient from "../../models/Patient.js";
import PharmacySale from "../../models/PharmacySale.js";
import Admission from "../../models/Admission.js";

// Utility to get start and end of dates for aggregation
const getStartOfDay = (date) => new Date(date).setHours(0, 0, 0, 0);

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

        // 1. OPD Revenue
        const opdPatients = await Patient.find(dateRangeFilter);
        const opdRevenue = opdPatients.reduce((sum, p) => sum + (p.finalFee || 0), 0);

        // 2. Pharmacy Revenue
        const pharmacySales = await PharmacySale.find({
            saleDate: { $gte: startOfDay, $lte: endOfDay }
        });
        const pharmacyRevenue = pharmacySales.reduce((sum, s) => sum + (s.finalAmount || 0), 0);

        // 3. IPD Revenue (Discharged today)
        const ipdDischarges = await Admission.find({
            dischargedAt: { $gte: startOfDay, $lte: endOfDay },
            status: "Discharged"
        });
        const ipdRevenue = ipdDischarges.reduce((sum, ad) => sum + (ad.totalBill || 0), 0);

        const totalRevenue = opdRevenue + pharmacyRevenue + ipdRevenue;

        return res.status(200).json({
            date: startOfDay.toISOString().split('T')[0],
            revenue: {
                opd: opdRevenue,
                pharmacy: pharmacyRevenue,
                ipd: ipdRevenue,
                total: totalRevenue
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
