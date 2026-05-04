import { Request, Response } from 'express';
import { FocusSessionService } from '../services/FocusSessionService';

export class FocusController {
    private focusService: FocusSessionService;

    constructor() {
        this.focusService = FocusSessionService.getInstance();
    }

    public startSession = async (req: Request, res: Response): Promise<void> => {
        try {
            const { taskId, durationMinutes } = req.body;
            if (!taskId) { res.status(400).json({ error: 'taskId is required' }); return; }
            const session = await this.focusService.startSession(taskId, durationMinutes);
            res.status(201).json(session);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public completeSession = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const session = await this.focusService.completeSession(id as string);
            if (!session) { res.status(404).json({ error: 'Session not found' }); return; }
            res.status(200).json(session);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public abandonSession = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const session = await this.focusService.abandonSession(id as string);
            if (!session) { res.status(404).json({ error: 'Session not found' }); return; }
            res.status(200).json(session);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public getProductivityScore = async (req: Request, res: Response): Promise<void> => {
        try {
            const score = await this.focusService.getProductivityScore();
            res.status(200).json({ score });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public getTaskPomodoros = async (req: Request, res: Response): Promise<void> => {
        try {
            const { taskId } = req.params;
            const count = await this.focusService.getTaskPomodoros(taskId as string);
            res.status(200).json({ count });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}
