import connectDB from "../../lib/db.js";
import PharmacySale from "../../models/PharmacySale.js";
import Medicine from "../../models/Medicine.js";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "POST") {
        try {
            const { items, patient, discount, paymentMethod } = req.body;
            
            // Validate stock and calculate total
            let totalAmount = 0;
            for (let item of items) {
                const medicine = await Medicine.findById(item.medicine);
                if (!medicine) return res.status(404).json({ error: `Medicine ${item.medicine} not found` });
                if (medicine.stockQuantity < item.quantity) {
                    return res.status(400).json({ error: `Insufficient stock for ${medicine.name}` });
                }
                item.pricePerUnit = medicine.mrp;
                item.totalPrice = medicine.mrp * item.quantity;
                totalAmount += item.totalPrice;
            }

            const finalAmount = totalAmount - (discount || 0);

            // Deduct stock
            for (let item of items) {
                await Medicine.findByIdAndUpdate(item.medicine, { $inc: { stockQuantity: -item.quantity } });
            }

            const sale = new PharmacySale({
                patient,
                items,
                totalAmount,
                discount,
                finalAmount,
                paymentMethod
            });

            await sale.save();
            return res.status(201).json(sale);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
