import mongoose from "mongoose";

const LabOrderSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    test: { type: mongoose.Schema.Types.ObjectId, ref: "LabTest", required: true },
    orderDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    results: { type: String }, // Can be structured JSON depending on test, storing as string for simplicity
    reportUrl: { type: String }, // Link to PDF or document
    paymentStatus: { type: String, enum: ["Unpaid", "Paid"], default: "Unpaid" }
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdated' } });

export default mongoose.models.LabOrder || mongoose.model("LabOrder", LabOrderSchema);
