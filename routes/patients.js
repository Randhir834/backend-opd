import connectDB from "../lib/db.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import { requireAuth } from "../lib/auth.js";

// ── Generate next OPD number ──────────────────────────────────────────────────
async function generateOpdNumber() {
    // Find the highest existing OPD number
    const last = await Patient.findOne({ opdNumber: /^OPD-\d+$/ })
        .sort({ opdNumber: -1 })
        .select("opdNumber")
        .lean();

    if (!last?.opdNumber) return "OPD-001";

    const num = parseInt(last.opdNumber.replace("OPD-", ""), 10);
    return `OPD-${String(num + 1).padStart(3, "0")}`;
}

export default async function handler(req, res) {
    await connectDB();

    // ── GET /api/patients?check=phone — duplicate check ──────────────────────
    if (req.method === "GET" && req.query.check) {
        try {
            const contact = req.query.check.trim();
            if (!contact) return res.status(200).json({ duplicate: false });
            const existing = await Patient.findOne({ contact })
                .populate("doctor", "name department")
                .select("name age gender opdNumber contact doctor creationDate")
                .lean();
            if (existing) {
                return res.status(200).json({ duplicate: true, patient: existing });
            }
            return res.status(200).json({ duplicate: false });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    // ── GET /api/patients?nextOpd=1 — return next OPD number ─────────────────
    if (req.method === "GET" && req.query.nextOpd) {
        try {
            const next = await generateOpdNumber();
            return res.status(200).json({ opdNumber: next });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    // ── GET /api/patients — list all ─────────────────────────────────────────
    if (req.method === "GET") {
        try {
            const patients = await Patient.find().populate("doctor").lean();
            return res.status(200).json(patients);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    // ── POST /api/patients — create ───────────────────────────────────────────
    if (req.method === "POST") {
        try {
            const {
                name, age, gender, contact, address, guardian,
                doctorId, discount, photo,
                abhaNumber, abhaAddress, mrid, pro, allergy,
                visitValidity, priority, caseType, sittingLocation,
                religion, maritalStatus, dob, city, area, nationality,
                patientClass, referredBy, complaints, empanelment,
                cashPatient, appointmentBioReceipt, registrationNo,
                registrationType, consultant, department, time,
            } = req.body;

            let resolvedDoctorId = doctorId;
            if (!resolvedDoctorId) {
                try {
                    const user = requireAuth(req);
                    if (user?.id) {
                        const doctorForUser = await Doctor.findOne({ userId: user.id });
                        resolvedDoctorId = doctorForUser?._id?.toString();
                    }
                } catch (_) { /* no auth token — ignore */ }
            }

            const doctor = await Doctor.findById(resolvedDoctorId);
            if (!doctor) return res.status(400).json({ error: "Doctor not found" });

            const finalFee = Math.max((doctor.consultationFee || 0) - (discount || 0), 0);

            // Auto-generate OPD number
            const opdNumber = await generateOpdNumber();

            const patient = new Patient({
                name, age, gender, contact, address, guardian,
                opdNumber,
                photo: photo || "",
                doctor: resolvedDoctorId,
                discount: discount || 0,
                finalFee,
                abhaNumber, abhaAddress, mrid, pro, allergy,
                visitValidity, priority, caseType, sittingLocation,
                religion, maritalStatus, dob, city, area, nationality,
                patientClass, referredBy, complaints, empanelment,
                cashPatient, appointmentBioReceipt, registrationNo,
                registrationType, consultant, department, time,
            });

            await patient.save();
            return res.status(201).json(patient);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
