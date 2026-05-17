import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import all route handlers
import adminDashboardHandler from './routes/admin-dashboard.js';
import analyticsFootfallHandler from './routes/analytics/footfall.js';
import analyticsPharmacyHandler from './routes/analytics/pharmacy.js';
import analyticsRevenueHandler from './routes/analytics/revenue.js';
import authLogoutHandler from './routes/auth/logout.js';
import authSigninHandler from './routes/auth/signin.js';
import authSignupHandler from './routes/auth/signup.js';
import authMeHandler from './routes/auth/me.js';
import doctorsHandler from './routes/doctors.js';
import emrPatientIdHandler from './routes/emr/patient/id.js';
import emrPrescriptionHandler from './routes/emr/prescription.js';

import ipdAdmitHandler from './routes/ipd/admit.js';
import ipdBedsHandler from './routes/ipd/beds.js';
import ipdDischargeHandler from './routes/ipd/discharge.js';
import ipdAdmissionsHandler from './routes/ipd/admissions.js';
import labsCatalogHandler from './routes/labs/catalog.js';
import labsOrderHandler from './routes/labs/order.js';
import labsReportIdHandler from './routes/labs/report/id.js';
import opdAppointmentsHandler from './routes/opd/appointments.js';
import opdAppointmentsIdHandler from './routes/opd/appointments/id.js';
import patientsHandler from './routes/patients.js';
import patientsIdHandler from './routes/patients/id.js';
import pharmacyAlertsHandler from './routes/pharmacy/alerts.js';
import pharmacyDispenseHandler from './routes/pharmacy/dispense.js';
import pharmacyInventoryHandler from './routes/pharmacy/inventory.js';
import encountersHandler from './routes/encounters.js';
import encountersIdHandler from './routes/encounters/id.js';


const app = express();

// Middleware
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());

// Helper to wrap Next.js-style handlers
function wrap(handler, isDynamic = false) {
  return async (req, res, next) => {
    try {
      if (isDynamic) {
        Object.assign(req.query, req.params);
      }
      await handler(req, res);
    } catch (err) {
      next(err);
    }
  };
}

// Mount routes
app.all('/api/admin-dashboard', wrap(adminDashboardHandler));
app.all('/api/analytics/footfall', wrap(analyticsFootfallHandler));
app.all('/api/analytics/pharmacy', wrap(analyticsPharmacyHandler));
app.all('/api/analytics/revenue', wrap(analyticsRevenueHandler));
app.all('/api/auth/logout', wrap(authLogoutHandler));
app.all('/api/auth/signin', wrap(authSigninHandler));
app.all('/api/auth/signup', wrap(authSignupHandler));
app.all('/api/auth/me', wrap(authMeHandler));
app.all('/api/doctors', wrap(doctorsHandler));
app.all('/api/emr/patient/:id', wrap(emrPatientIdHandler, true));
app.all('/api/emr/prescription', wrap(emrPrescriptionHandler));

app.all('/api/ipd/admit', wrap(ipdAdmitHandler));
app.all('/api/ipd/beds', wrap(ipdBedsHandler));
app.all('/api/ipd/discharge', wrap(ipdDischargeHandler));
app.all('/api/ipd/admissions', wrap(ipdAdmissionsHandler));
app.all('/api/labs/catalog', wrap(labsCatalogHandler));
app.all('/api/labs/order', wrap(labsOrderHandler));
app.all('/api/labs/report/:id', wrap(labsReportIdHandler, true));
app.all('/api/opd/appointments', wrap(opdAppointmentsHandler));
app.all('/api/opd/appointments/:id', wrap(opdAppointmentsIdHandler, true));
app.all('/api/patients', wrap(patientsHandler));
app.all('/api/patients/:id', wrap(patientsIdHandler, true));
app.all('/api/pharmacy/alerts', wrap(pharmacyAlertsHandler));
app.all('/api/pharmacy/dispense', wrap(pharmacyDispenseHandler));
app.all('/api/pharmacy/inventory', wrap(pharmacyInventoryHandler));
app.all('/api/encounters', wrap(encountersHandler));
app.all('/api/encounters/:id', wrap(encountersIdHandler, true));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
