import connectDB from "../../lib/db.js";
import Medicine from "../../models/Medicine.js";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "GET") {
        try {
            // Find medicines where stock is below or equal to reorder level
            const lowStockAlerts = await Medicine.find({
                $expr: { $lte: ["$stockQuantity", "$reorderLevel"] }
            }).sort({ stockQuantity: 1 });

            // Find medicines expiring within next 90 days
            const ninetyDaysFromNow = new Date();
            ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
            
            const expiryAlerts = await Medicine.find({
                expiryDate: { $lte: ninetyDaysFromNow }
            }).sort({ expiryDate: 1 });

            return res.status(200).json({ lowStockAlerts, expiryAlerts });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
