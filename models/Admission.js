import mongoose from "mongoose";

const AdmissionSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    bed: { type: mongoose.Schema.Types.ObjectId, ref: "Bed", required: true },
    admittedAt: { type: Date, default: Date.now },
    dischargedAt: { type: Date },
    status: { type: String, enum: ["Admitted", "Discharged"], default: "Admitted" },
    admittingDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    nursingNotes: { type: String },
    totalBill: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ["Pending", "Paid"], default: "Pending" }
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdated' } });

export default mongoose.models.Admission || mongoose.model("Admission", AdmissionSchema);
