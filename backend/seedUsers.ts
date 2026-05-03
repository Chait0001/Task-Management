import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserModel } from './src/models/User';

dotenv.config();

const seedUsers = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI is not defined in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const usersToCreate = Array.from({ length: 5 }).map((_, index) => ({
            name: `Test User ${index + 1}`,
            email: `testuser${index + 1}@example.com`
        }));

        const result = await UserModel.insertMany(usersToCreate);
        console.log(`✅ Successfully signed up 5 users:`);
        result.forEach(u => console.log(`   - ${u.name} (${u.email})`));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error signing up users:', error);
        process.exit(1);
    }
};

seedUsers();
