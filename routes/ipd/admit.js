import connectDB from "../../lib/db.js";
import Admission from "../../models/Admission.js";
import Bed from "../../models/Bed.js";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "POST") {
        try {
            const { patient, bed, admittingDoctor, nursingNotes } = req.body;
            
            // Check bed availability
            const targetBed = await Bed.findById(bed);
            if (!targetBed) return res.status(404).json({ error: "Bed not found" });
            if (targetBed.isOccupied) return res.status(400).json({ error: "Bed is already occupied" });

            // Create admission
            const admission = new Admission({
                patient,
                bed,
                admittingDoctor,
                nursingNotes,
                status: "Admitted"
            });

            // Mark bed as occupied
            targetBed.isOccupied = true;
            await targetBed.save();
            await admission.save();

            return res.status(201).json(admission);
        } catch (error) {
             return res.status(400).json({ error: error.message });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
