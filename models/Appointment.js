import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    appointmentDate: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ["Scheduled", "Completed", "Cancelled"], 
        default: "Scheduled" 
    },
    queueNumber: { type: Number },
    notes: { type: String }
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdated' } });

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);
