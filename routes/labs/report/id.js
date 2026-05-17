import connectDB from "../../../lib/db.js";
import LabOrder from "../../../models/LabOrder.js";

export default async function handler(req, res) {
    await connectDB();
    const { id } = req.params;

    if (req.method === "PUT") {
        try {
            const { results, reportUrl, status } = req.body;
            
            const order = await LabOrder.findByIdAndUpdate(
                id,
                { results, reportUrl, status: status || 'Completed' },
                { new: true }
            );
            
            if (!order) return res.status(404).json({ error: "Order not found" });
            
            return res.status(200).json(order);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    } else if (req.method === "GET") {
        try {
            const order = await LabOrder.findById(id)
                .populate('patient', 'name age gender')
                .populate('test', 'testName normalRange');
            if (!order) return res.status(404).json({ error: "Order not found" });
            return res.status(200).json(order);
        } catch (error) {
             return res.status(500).json({ error: error.message });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
