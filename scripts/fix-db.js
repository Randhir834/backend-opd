const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

function getMongoUri() {
    const envPath = path.join(__dirname, '../.env');
    if (!fs.existsSync(envPath)) return null;
    const env = fs.readFileSync(envPath, 'utf8');
    const match = env.match(/MONGO_URI=(.*)/);
    return match ? match[1].trim() : null;
}

async function fix() {
    const mongoUri = getMongoUri();
    if (!mongoUri) {
        console.error('MONGO_URI not found in .env');
        return;
    }

    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        try {
            console.log('Dropping users collection to clear stale data and indexes...');
            await mongoose.connection.db.dropCollection('users');
            console.log('Users collection dropped.');
        } catch (e) {
            console.log('Users collection might not exist or already dropped:', e.message);
        }

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (err) {
        console.error('Error:', err.message);
    }
}

fix();
