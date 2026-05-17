// models/Doctor.js
import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    department: { type: String, default: "" },
    contact: { type: String, default: "" },
    consultationFee: { type: Number, default: 0 },
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdated' } });

export default mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);
