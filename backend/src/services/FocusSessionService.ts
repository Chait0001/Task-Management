import { PomodoroSessionModel, IPomodoroSession } from '../models/PomodoroSession';

export class FocusSessionService {
    private static instance: FocusSessionService;

    private constructor() {}

    public static getInstance(): FocusSessionService {
        if (!FocusSessionService.instance) {
            FocusSessionService.instance = new FocusSessionService();
        }
        return FocusSessionService.instance;
    }

    public async startSession(taskId: string, durationMinutes: number = 25): Promise<IPomodoroSession> {
        // Abandon any currently active sessions
        await PomodoroSessionModel.updateMany(
            { status: 'ACTIVE' },
            { $set: { status: 'ABANDONED', endTime: new Date() } }
        );

        const session = new PomodoroSessionModel({
            taskId,
            startTime: new Date(),
            durationMinutes,
            status: 'ACTIVE'
        });
        return await session.save();
    }

    public async completeSession(sessionId: string): Promise<IPomodoroSession | null> {
        return await PomodoroSessionModel.findByIdAndUpdate(
            sessionId,
            { status: 'COMPLETED', endTime: new Date() },
            { new: true }
        );
    }

    public async abandonSession(sessionId: string): Promise<IPomodoroSession | null> {
        return await PomodoroSessionModel.findByIdAndUpdate(
            sessionId,
            { status: 'ABANDONED', endTime: new Date() },
            { new: true }
        );
    }

    public async getProductivityScore(): Promise<number> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const completedToday = await PomodoroSessionModel.countDocuments({
            status: 'COMPLETED',
            endTime: { $gte: today }
        });

        // Arbitrary score: 10 points per completed pomodoro
        return completedToday * 10;
    }
    
    public async getTaskPomodoros(taskId: string): Promise<number> {
        return await PomodoroSessionModel.countDocuments({
            taskId,
            status: 'COMPLETED'
        });
    }
}
