// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: "" },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isDoctor: { type: Boolean, default: false },
    department: { type: String, default: "" },
    specialization: { type: String, default: "" },
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastUpdated' } });

export default mongoose.models.User || mongoose.model("User", UserSchema);
