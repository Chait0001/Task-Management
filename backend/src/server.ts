import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 4000;
const MONGODB_URI: string = process.env.MONGODB_URI || '';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Task Management API is running with MongoDB');
});

app.use('/api', taskRoutes);

// MongoDB Connection
if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in the environment variables');
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    });