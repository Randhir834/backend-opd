import mongoose from "mongoose";

const PharmacySaleSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    items: [{
        medicine: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
        quantity: { type: Number, required: true },
        pricePerUnit: { type: Number, required: true },
        totalPrice: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["Cash", "Card", "UPI", "Other"], default: "Cash" }
}, { timestamps: { createdAt: 'saleDate', updatedAt: 'lastUpdated' } });

export default mongoose.models.PharmacySale || mongoose.model("PharmacySale", PharmacySaleSchema);
