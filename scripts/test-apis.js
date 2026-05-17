const BASE_URL = 'http://localhost:3000/api';

async function testAPI(endpoint, method = 'GET', body = null) {
    try {
        const url = `${BASE_URL}${endpoint}`;
        console.log(`Testing ${method} ${url}...`);
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
        };
        if (body) options.body = JSON.stringify(body);
        
        const response = await fetch(url, options);
        const data = await response.json();
        if (response.ok) {
            console.log(`✅ Success: ${endpoint}`);
            return data;
        } else {
            console.error(`❌ Error in ${endpoint}:`, data);
            return null;
        }
    } catch (error) {
        console.error(`💥 Connection error in ${endpoint}:`, error.message);
        return null;
    }
}

async function runTests() {
    console.log('🚀 Starting API Tests...\n');

    const doctor = await testAPI('/doctors', 'POST', {
        name: "Dr. Smith",
        department: "Cardiology",
        contact: "1234567890",
        consultationFee: 500
    });
    if (!doctor) return;

    const patient = await testAPI('/patients', 'POST', {
        name: "John Doe",
        age: 30,
        gender: "Male",
        contact: "9876543210",
        department: "Cardiology",
        doctorId: doctor._id
    });
    if (!patient) return;

    console.log('\n--- OPD Module ---');
    const appointment = await testAPI('/opd/appointments', 'POST', {
        patient: patient._id,
        doctor: doctor._id,
        appointmentDate: new Date().toISOString(),
        notes: "Regular checkup"
    });
    await testAPI('/opd/appointments');

    console.log('\n--- EMR Module ---');
    const prescription = await testAPI('/emr/prescription', 'POST', {
        patient: patient._id,
        doctor: doctor._id,
        vitals: { bloodPressure: "120/80", temperature: "98.6" },
        symptoms: ["Headache", "Fever"],
        diagnosis: ["Common Cold"],
        medicines: [{ name: "Paracetamol", dosage: "500mg", frequency: "1-0-1", duration: "3 days" }]
    });
    await testAPI(`/emr/patient/${patient._id}`);

    console.log('\n--- Pharmacy Module ---');
    const medicine = await testAPI('/pharmacy/inventory', 'POST', {
        name: "Paracetamol",
        batchNumber: "BATCH123",
        expiryDate: "2026-12-31",
        mrp: 10,
        stockQuantity: 100
    });
    if (medicine) {
        await testAPI('/pharmacy/dispense', 'POST', {
            items: [{ medicine: medicine._id, quantity: 5 }],
            paymentMethod: "Cash"
        });
    }
    await testAPI('/pharmacy/alerts');

    console.log('\n--- Labs Module ---');
    const labTest = await testAPI('/labs/catalog', 'POST', {
        testName: "Blood Glucose",
        category: "Blood",
        price: 200,
        normalRange: "70-110 mg/dL"
    });
    if (labTest) {
        const order = await testAPI('/labs/order', 'POST', {
            patient: patient._id,
            test: labTest._id,
            doctor: doctor._id
        });
        if (order) {
            await testAPI(`/labs/report/${order._id}`, 'PUT', {
                results: "95 mg/dL",
                status: "Completed"
            });
        }
    }

    console.log('\n--- IPD Module ---');
    const bed = await testAPI('/ipd/beds', 'POST', {
        wardName: "General Ward",
        bedNumber: "G101",
        pricePerDay: 1000
    });
    if (bed) {
        const admission = await testAPI('/ipd/admit', 'POST', {
            patient: patient._id,
            bed: bed._id,
            admittingDoctor: doctor._id
        });
        if (admission) {
            await testAPI('/ipd/discharge', 'POST', {
                admissionId: admission._id,
                extraCharges: 500
            });
        }
    }

    console.log('\n--- Website Module ---');
    await testAPI('/website/notices', 'POST', {
        title: "Holiday Announcement",
        content: "Hospital will remain closed on Sunday."
    });
    await testAPI('/website/notices');

    console.log('\n--- Analytics Module ---');
    await testAPI('/analytics/revenue');
    await testAPI('/analytics/footfall');
    await testAPI('/analytics/pharmacy');

    console.log('\n--- Hiring Module ---');
    const job = await testAPI('/hiring/jobs', 'POST', {
        title: "Staff Nurse",
        department: "Nursing",
        description: "Looking for experienced staff nurse."
    });
    if (job) {
        await testAPI('/hiring/apply', 'POST', {
            jobId: job._id,
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "1122334455"
        });
    }
    await testAPI('/hiring/jobs');

    console.log('\n🏁 Tests Completed.');
}

runTests();
