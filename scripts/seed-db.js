const BASE_URL = 'http://localhost:3000/api';

async function post(endpoint, body) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        if (response.ok) {
            console.log(`✅ Seeded: ${endpoint} (${body.name || body.title || body.testName || body.bedNumber || 'Data'})`);
            return data;
        } else {
            console.error(`❌ Failed ${endpoint}:`, data);
            return null;
        }
    } catch (err) {
        console.error(`💥 Error seeding ${endpoint}:`, err.message);
        return null;
    }
}

async function seed() {
    console.log('🌱 Information System Seeding Started...\n');

    console.log('--- Seeding Doctors ---');
    const d1 = await post('/doctors', { name: "Dr. Alice Sharma", department: "Cardiology", contact: "9988776655", consultationFee: 800 });
    const d2 = await post('/doctors', { name: "Dr. Bob Mehta", department: "Orthopedics", contact: "8877665544", consultationFee: 600 });
    const d3 = await post('/doctors', { name: "Dr. Clara Kent", department: "Pediatrics", contact: "7766554433", consultationFee: 500 });
    const d4 = await post('/doctors', { name: "Dr. Dave Kumar", department: "Neurology", contact: "6655443322", consultationFee: 1000 });
    const d5 = await post('/doctors', { name: "Dr. Emily Singh", department: "Dermatology", contact: "5544332211", consultationFee: 700 });
    const d6 = await post('/doctors', { name: "Dr. Farooq Ali", department: "General Medicine", contact: "4433221100", consultationFee: 400 });

    console.log('\n--- Seeding Patients ---');
    await post('/patients', { name: "Rahul Singh", age: 45, gender: "Male", contact: "9000000001", doctorId: d1?._id, department: "Cardiology" });
    await post('/patients', { name: "Sita Devi", age: 62, gender: "Female", contact: "9000000002", doctorId: d2?._id, department: "Orthopedics" });
    await post('/patients', { name: "Master Aryan", age: 8, gender: "Male", contact: "9000000003", doctorId: d3?._id, department: "Pediatrics" });
    await post('/patients', { name: "Ananya Patel", age: 29, gender: "Female", contact: "9000000004", doctorId: d5?._id, department: "Dermatology" });
    const p5 = await post('/patients', { name: "Vikram Das", age: 55, gender: "Male", contact: "9000000005", doctorId: d4?._id, department: "Neurology" });
    const p6 = await post('/patients', { name: "Neha Gupta", age: 34, gender: "Female", contact: "9000000006", doctorId: d6?._id, department: "General Medicine" });
    await post('/patients', { name: "Rohan Iyer", age: 21, gender: "Male", contact: "9000000007", doctorId: d2?._id, department: "Orthopedics" });
    await post('/patients', { name: "Pooja Verma", age: 41, gender: "Female", contact: "9000000008", doctorId: d1?._id, department: "Cardiology" });
    await post('/patients', { name: "Ramesh Choudhary", age: 72, gender: "Male", contact: "9000000009", doctorId: d6?._id, department: "General Medicine" });
    await post('/patients', { name: "Geeta Sharma", age: 26, gender: "Female", contact: "9000000010", doctorId: d5?._id, department: "Dermatology" });
    await post('/patients', { name: "Baby Kiara", age: 3, gender: "Female", contact: "9000000011", doctorId: d3?._id, department: "Pediatrics" });
    await post('/patients', { name: "Kabir Khan", age: 48, gender: "Male", contact: "9000000012", doctorId: d4?._id, department: "Neurology" });

    // Seed historical Analytics: Simulate revenue and footfall by creating "older" patient entries if possible.
    // For simplicity, we just add high volume for today.

    console.log('\n--- Seeding Pharmacy ---');
    await post('/pharmacy/inventory', { name: "Amoxicillin", genericName: "Antibiotic", batchNumber: "AMX001", expiryDate: "2026-10-15", mrp: 120, stockQuantity: 500, reorderLevel: 50 });
    await post('/pharmacy/inventory', { name: "Ibuprofen", genericName: "Painkiller", batchNumber: "IBU099", expiryDate: "2025-05-20", mrp: 45, stockQuantity: 200, reorderLevel: 30 });
    await post('/pharmacy/inventory', { name: "Cough Syrup", genericName: "Expectorant", batchNumber: "CS123", expiryDate: "2024-12-01", mrp: 90, stockQuantity: 15, reorderLevel: 20 });
    await post('/pharmacy/inventory', { name: "Paracetamol", genericName: "Antipyretic", batchNumber: "PCM500", expiryDate: "2027-01-10", mrp: 20, stockQuantity: 1000, reorderLevel: 100 });
    await post('/pharmacy/inventory', { name: "Cetirizine", genericName: "Antihistamine", batchNumber: "CET010", expiryDate: "2025-08-22", mrp: 35, stockQuantity: 300, reorderLevel: 50 });
    await post('/pharmacy/inventory', { name: "Omeprazole", genericName: "Antacid", batchNumber: "OMP020", expiryDate: "2026-03-30", mrp: 85, stockQuantity: 0, reorderLevel: 40 }); // Intentional empty stock
    await post('/pharmacy/inventory', { name: "Metformin", genericName: "Anti-Diabetic", batchNumber: "MET005", expiryDate: "2024-11-05", mrp: 150, stockQuantity: 10, reorderLevel: 25 }); // Low stock

    console.log('\n--- Seeding Lab Catalog ---');
    const t1 = await post('/labs/catalog', { testName: "Complete Blood Count (CBC)", category: "Pathology", price: 350, normalRange: "Various" });
    const t2 = await post('/labs/catalog', { testName: "Chest X-Ray", category: "Radiology", price: 1200, normalRange: "Normal/Abnormal" });
    const t3 = await post('/labs/catalog', { testName: "Lipid Profile", category: "Pathology", price: 800, normalRange: "Healthy/At-risk" });
    const t4 = await post('/labs/catalog', { testName: "Liver Function Test (LFT)", category: "Pathology", price: 900, normalRange: "Standard" });
    const t5 = await post('/labs/catalog', { testName: "MRI Brain", category: "Radiology", price: 8500, normalRange: "Normal/Abnormal" });
    const t6 = await post('/labs/catalog', { testName: "Urine Routine", category: "Pathology", price: 150, normalRange: "Standard" });

    console.log('\n--- Seeding Lab Orders ---');
    if (p5 && t5 && d4) await post('/labs/order', { patient: p5._id, doctor: d4._id, test: t5._id });
    if (p6 && t1 && d6) await post('/labs/order', { patient: p6._id, doctor: d6._id, test: t1._id });

    console.log('\n--- Seeding IPD Beds ---');
    await post('/ipd/beds', { wardName: "A-Ward (ICU)", bedNumber: "ICU-01", type: "ICU", pricePerDay: 5000 });
    await post('/ipd/beds', { wardName: "A-Ward (ICU)", bedNumber: "ICU-02", type: "ICU", pricePerDay: 5000 });
    await post('/ipd/beds', { wardName: "A-Ward (ICU)", bedNumber: "ICU-03", type: "ICU", pricePerDay: 5000 });
    await post('/ipd/beds', { wardName: "A-Ward (ICU)", bedNumber: "ICU-04", type: "ICU", pricePerDay: 5000 });
    await post('/ipd/beds', { wardName: "B-Ward (General)", bedNumber: "GEN-101", type: "General", pricePerDay: 1200 });
    await post('/ipd/beds', { wardName: "B-Ward (General)", bedNumber: "GEN-102", type: "General", pricePerDay: 1200 });
    await post('/ipd/beds', { wardName: "B-Ward (General)", bedNumber: "GEN-103", type: "General", pricePerDay: 1200 });
    await post('/ipd/beds', { wardName: "B-Ward (General)", bedNumber: "GEN-104", type: "General", pricePerDay: 1200 });
    await post('/ipd/beds', { wardName: "C-Ward (Semi-Private)", bedNumber: "SP-201", type: "General", pricePerDay: 2500 });
    await post('/ipd/beds', { wardName: "C-Ward (Semi-Private)", bedNumber: "SP-202", type: "General", pricePerDay: 2500 });

    console.log('\n--- Seeding Website CMS ---');
    await post('/website/notices', { title: "Blood Donation Camp", content: "Join us on April 25th for our annual blood donation drive in the east wing.", targetAudience: "Public" });
    await post('/website/notices', { title: "New OPD Timings", content: "Effective from next Monday, OPD will start at 8:00 AM.", targetAudience: "Patients" });
    await post('/website/notices', { title: "Pharmacy Discount Day", content: "Get flat 10% off on all generic medicines this Friday.", targetAudience: "Patients" });
    await post('/website/notices', { title: "COVID-19 Advisory Updated", content: "Please wear a mask when visiting the hospital premise.", targetAudience: "Public" });

    console.log('\n--- Seeding Hiring ---');
    const j1 = await post('/hiring/jobs', { title: "Resident Medical Officer", department: "Emergency", description: "Looking for an RMO for night shifts. Will handle incoming trauma patients.", requirements: ["MBBS", "2+ years experience"] });
    const j2 = await post('/hiring/jobs', { title: "Lead Pharmacist", department: "Pharmacy", description: "Manage the central drug store and pharmacy operations.", requirements: ["B.Pharm/M.Pharm", "5+ years experience"] });
    const j3 = await post('/hiring/jobs', { title: "Senior Staff Nurse", department: "ICU", description: "Monitor ICU patients and track vitals.", requirements: ["B.Sc Nursing", "3+ years ICU experience"] });
    const j4 = await post('/hiring/jobs', { title: "Lab Technician", department: "Pathology", description: "Perform daily blood tests and maintain lab catalog.", requirements: ["DMLT", "1+ year experience"] });

    console.log('\n--- Seeding Applicants for Jobs ---');
    if (j1) await post('/hiring/apply', { jobId: j1._id, name: "Dr. Aman Roy", email: "aman.roy@email.com", phone: "9191919191", experience: 3, resumeLink: "http://example.com/resume_aman.pdf" });
    if (j1) await post('/hiring/apply', { jobId: j1._id, name: "Dr. Priya Sen", email: "priya.sen@email.com", phone: "9292929292", experience: 2, resumeLink: "http://example.com/resume_priya.pdf" });
    if (j3) await post('/hiring/apply', { jobId: j3._id, name: "Maria Gonzalez", email: "maria.g@email.com", phone: "9393939393", experience: 4, resumeLink: "http://example.com/resume_maria.pdf" });
    if (j4) await post('/hiring/apply', { jobId: j4._id, name: "Karan Johar", email: "karan.j@email.com", phone: "9494949494", experience: 1, resumeLink: "http://example.com/resume_karan.pdf" });

    console.log('\n✨ Seeding Complete. The platform is ready for demonstration!');
}

seed();
