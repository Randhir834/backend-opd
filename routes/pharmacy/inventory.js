import connectDB from "../../lib/db.js";
import Medicine from "../../models/Medicine.js";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "POST") {
        try {
            const medicine = new Medicine(req.body);
            await medicine.save();
            return res.status(201).json(medicine);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    } else if (req.method === "GET") {
        try {
            const { name } = req.query;
            let filter = {};
            if (name) filter.name = { $regex: name, $options: "i" };
            
            const inventory = await Medicine.find(filter).sort({ name: 1 });
            return res.status(200).json(inventory);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
