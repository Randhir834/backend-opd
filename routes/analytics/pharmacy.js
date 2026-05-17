import connectDB from "../../lib/db.js";
import PharmacySale from "../../models/PharmacySale.js";
import Medicine from "../../models/Medicine.js";

export default async function handler(req, res) {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    await connectDB();

    try {
        // Fast moving medicines (most sold in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const topSales = await PharmacySale.aggregate([
            { $match: { saleDate: { $gte: thirtyDaysAgo } } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.medicine",
                    totalQuantitySold: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: "$items.totalPrice" }
                }
            },
            { $sort: { totalQuantitySold: -1 } },
            { $limit: 10 }
        ]);

        // Populate medicine details
        const populatedSales = await Promise.all(topSales.map(async (sale) => {
            const med = await Medicine.findById(sale._id).select('name genericName stockQuantity');
            return {
                medicine: med,
                quantitySold: sale.totalQuantitySold,
                revenue: sale.totalRevenue
            };
        }));

        // Out of stock
        const outOfStock = await Medicine.find({ stockQuantity: 0 }).select('name batchNumber mrp');

        return res.status(200).json({
            fastMoving: populatedSales,
            outOfStock
        });
    } catch (error) {
         return res.status(500).json({ error: error.message });
    }
}
