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

// ─── CORS ────────────────────────────────────────────────────────────────────
// Allow the Vite dev server, any Vercel preview / production domain, and an
// optional FRONTEND_URL environment variable for custom domains.
const allowedOrigins: (string | RegExp)[] = [
    'http://localhost:3000',
    'http://localhost:4000',
    /\.vercel\.app$/,          // covers every *.vercel.app preview/prod URL
];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (curl, Postman, server-to-server)
        if (!origin) return callback(null, true);

        const allowed = allowedOrigins.some((pattern) =>
            typeof pattern === 'string' ? pattern === origin : pattern.test(origin)
        );

        if (allowed) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: origin "${origin}" not allowed`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health-check ─────────────────────────────────────────────────────────────
app.get('/', (_req: Request, res: Response) => {
    res.json({
        message: 'Task Management API is running',
        status: 'ok',
        dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', taskRoutes);

// ─── 404 fallback ─────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// ─── MongoDB + Server ─────────────────────────────────────────────────────────
if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in the environment variables');
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => {
        const dbName = mongoose.connection.db?.databaseName ?? 'unknown';
        console.log(`✅ Connected to MongoDB — database: "${dbName}"`);
        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    })
    .catch((error: Error) => {
        console.error('❌ Error connecting to MongoDB:', error.message);
        process.exit(1);
    });