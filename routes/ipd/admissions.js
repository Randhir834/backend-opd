import connectDB from "../../lib/db.js";
import Admission from "../../models/Admission.js";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "GET") {
        try {
            const admissions = await Admission.find()
                .populate('patient', 'name age gender contact')
                .populate('bed', 'wardName bedNumber type pricePerDay')
                .populate('admittingDoctor', 'name department')
                .sort({ admittedAt: -1 })
                .lean();
            return res.status(200).json(admissions);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
