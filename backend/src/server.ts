import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Task Management API is running');
});

app.use('/api', taskRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});