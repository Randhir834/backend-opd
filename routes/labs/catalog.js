import connectDB from "../../lib/db.js";
import LabTest from "../../models/LabTest.js";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "POST") {
        try {
            const test = new LabTest(req.body);
            await test.save();
            return res.status(201).json(test);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    } else if (req.method === "GET") {
        try {
            const { category } = req.query;
            let filter = { isActive: true };
            if (category) filter.category = category;
            
            const catalog = await LabTest.find(filter).sort({ testName: 1 });
            return res.status(200).json(catalog);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
