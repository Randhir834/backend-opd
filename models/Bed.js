import mongoose from "mongoose";

const BedSchema = new mongoose.Schema({
    wardName: { type: String, required: true },
    bedNumber: { type: String, required: true },
    type: { type: String, enum: ["General", "Semi-Private", "Private", "ICU", "NICU"], default: "General" },
    pricePerDay: { type: Number, required: true },
    isOccupied: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdated' } });

export default mongoose.models.Bed || mongoose.model("Bed", BedSchema);
