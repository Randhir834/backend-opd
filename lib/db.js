// lib/db.js
import mongoose from "mongoose";

const connectDB = async () => {
    // Avoid multiple connections
    if (mongoose.connections[0].readyState) return;

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
};

export default connectDB;
