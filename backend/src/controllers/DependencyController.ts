import { Request, Response } from 'express';
import { DependencyGraph } from '../services/DependencyGraph';

export class DependencyController {
    private graph: DependencyGraph;

    constructor() {
        this.graph = DependencyGraph.getInstance();
    }

    public addDependency = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params; // taskId
            const { blockedById } = req.body;
            if (!blockedById) { res.status(400).json({ error: 'blockedById is required' }); return; }
            
            const task = await this.graph.addDependency(id as string, blockedById as string);
            if (!task) { res.status(404).json({ error: 'Task not found' }); return; }
            
            res.status(200).json(task);
        } catch (error: any) {
            if (error.message.includes('cycle')) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    };

    public removeDependency = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { blockedById } = req.body;
            if (!blockedById) { res.status(400).json({ error: 'blockedById is required' }); return; }

            const task = await this.graph.removeDependency(id as string, blockedById as string);
            if (!task) { res.status(404).json({ error: 'Task not found' }); return; }

            res.status(200).json(task);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public checkCycle = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { blockedById } = req.query;
            if (!blockedById) { res.status(400).json({ error: 'blockedById is required' }); return; }

            const cycle = await this.graph.wouldCreateCycle(id as string, blockedById as string);
            res.status(200).json({ cycle });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}
