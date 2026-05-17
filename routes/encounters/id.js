// routes/encounters/id.js
import connectDB from "../../lib/db.js";
import Encounter from "../../models/Encounter.js";

export default async function handler(req, res) {
    await connectDB();

    const { id } = req.params;

    if (req.method === "GET") {
        try {
            const encounter = await Encounter.findById(id);
            if (!encounter) return res.status(404).json({ message: "Encounter not found" });
            res.status(200).json(encounter);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else if (req.method === "PUT") {
        try {
            const encounter = await Encounter.findByIdAndUpdate(id, req.body, { new: true });
            if (!encounter) return res.status(404).json({ message: "Encounter not found" });
            res.status(200).json(encounter);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
