import connectDB from "../../lib/db.js";
import Bed from "../../models/Bed.js";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "POST") {
        try {
            const bed = new Bed(req.body);
            await bed.save();
            return res.status(201).json(bed);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    } else if (req.method === "GET") {
        try {
            const { isOccupied, wardName } = req.query;
            let filter = {};
            if (isOccupied !== undefined) filter.isOccupied = isOccupied === 'true';
            if (wardName) filter.wardName = wardName;
            
            const beds = await Bed.find(filter).sort({ wardName: 1, bedNumber: 1 });
            return res.status(200).json(beds);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
