import mongoose from "mongoose";

const LabTestSchema = new mongoose.Schema({
    testName: { type: String, required: true },
    category: { type: String, required: true }, // e.g., Blood, Imaging, Urine
    price: { type: Number, required: true },
    normalRange: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdated' } });

export default mongoose.models.LabTest || mongoose.model("LabTest", LabTestSchema);
