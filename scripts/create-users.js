const BASE_URL = 'http://localhost:3000/api/auth';

async function createUser(username, password, isAdmin, email) {
    try {
        const response = await fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, isAdmin, email }),
        });
        const data = await response.json();
        if (response.ok) {
            console.log(`✅ User created: ${username} (Admin: ${isAdmin})`);
        } else {
            console.log(`❌ Failed: ${username} - ${data.message}`);
        }
    } catch (err) {
        console.error(`💥 Error: ${err.message}`);
    }
}

async function run() {
    console.log('👤 Creating sample users...\n');
    await createUser('admin', 'admin123', true, 'admin@clinx.com');
    await createUser('user', 'user123', false, 'staff@clinx.com');
    console.log('\n✨ Done. You can now login with these credentials.');
}

run();
