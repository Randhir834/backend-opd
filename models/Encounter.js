import mongoose from "mongoose";

const EncounterSchema = new mongoose.Schema({
    patientId:  { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    visitDate:  { type: Date, default: Date.now },
    visitType:  { type: String, default: "OPD" },

    vitals: {
        pulse:           { type: String, default: "" },
        bloodPressure:   { type: String, default: "" },
        temperature:     { type: String, default: "" },
        respiratoryRate: { type: String, default: "" },
        spo2:            { type: String, default: "" },
        height:          { type: String, default: "" },
        weight:          { type: String, default: "" },
        bmi:             { type: String, default: "" },
    },

    chiefComplaints:    [{ type: String }],
    signsAndSymptoms:   [{ type: String }],

    provisionalDiagnosis: { type: String, default: "" },
    finalDiagnosis:       { type: String, default: "" },
    icdCode:              { type: String, default: "" },

    medication: [{
        medicineName: { type: String, default: "" },
        dosage:       { type: String, default: "" },
        frequency:    { type: String, default: "" },
        duration:     { type: String, default: "" },
        route:        { type: String, default: "" },
        instructions: { type: String, default: "" },
    }],

    labAndRadiology: [{
        testName:     { type: String, default: "" },
        testType:     { type: String, default: "" },
        instructions: { type: String, default: "" },
    }],

    pastHistory: [{
        condition: { type: String, default: "" },
        year:      { type: String, default: "" },
        notes:     { type: String, default: "" },
    }],

    allergies: [{
        allergen:  { type: String, default: "" },
        reaction:  { type: String, default: "" },
        severity:  { type: String, default: "" },
    }],

    prescribedProcedures: [{
        procedureName: { type: String, default: "" },
        bodyPart:      { type: String, default: "" },
        instructions:  { type: String, default: "" },
    }],

    vaccinationStatus: [{
        vaccineName: { type: String, default: "" },
        dateGiven:   { type: String, default: "" },
        nextDue:     { type: String, default: "" },
    }],

    doctorNotes:  { type: String, default: "" },
    doctorAdvice: { type: String, default: "" },

    referral: {
        doctorType: { type: String, default: "In-House" },
        department: { type: String, default: "" },
        referredTo: { type: String, default: "" },
        type:       { type: String, default: "Routine" },
        diagnosis:  { type: String, default: "" },
        remarks:    { type: String, default: "" },
    },

    status: { type: String, default: "In-Progress" },

}, { timestamps: { createdAt: "creationDate", updatedAt: "lastUpdated" } });

export default mongoose.models.Encounter || mongoose.model("Encounter", EncounterSchema);
