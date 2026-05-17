import mongoose from "mongoose";

const MedicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    genericName: { type: String },
    manufacturer: { type: String },
    batchNumber: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    mrp: { type: Number, required: true },
    stockQuantity: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 10 }
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdated' } });

export default mongoose.models.Medicine || mongoose.model("Medicine", MedicineSchema);
