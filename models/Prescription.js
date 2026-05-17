import mongoose from "mongoose";

const MedicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dosage: { type: String }, // e.g. 500mg
    frequency: { type: String }, // e.g. 1-0-1
    duration: { type: String }, // e.g. 5 days
    instructions: { type: String } // e.g. After meals
}, { _id: false });

const PrescriptionSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    vitals: {
        bloodPressure: String,
        temperature: String,
        weight: String,
        pulse: String,
        oxygenSaturation: String
    },
    symptoms: [String],
    diagnosis: [String],
    medicines: [MedicineSchema],
    clinicalNotes: { type: String },
    nextFollowUp: { type: Date }
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdated' } });

export default mongoose.models.Prescription || mongoose.model("Prescription", PrescriptionSchema);
