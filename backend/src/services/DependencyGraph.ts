import { TaskModel, ITask } from '../models/Task';
import mongoose from 'mongoose';

export class DependencyGraph {
    private static instance: DependencyGraph;

    private constructor() {}

    public static getInstance(): DependencyGraph {
        if (!DependencyGraph.instance) {
            DependencyGraph.instance = new DependencyGraph();
        }
        return DependencyGraph.instance;
    }

    /**
     * Checks if adding dependency `blockedByTaskId` to `taskId` creates a cycle.
     * Uses Iterative DFS to prevent stack overflow.
     */
    public async wouldCreateCycle(taskId: string, blockedByTaskId: string): Promise<boolean> {
        if (taskId === blockedByTaskId) return true;

        const stack: string[] = [blockedByTaskId];
        const visited = new Set<string>();

        while (stack.length > 0) {
            const currentId = stack.pop()!;
            
            if (visited.has(currentId)) continue;
            visited.add(currentId);

            if (currentId === taskId) {
                return true;
            }

            const currentTask = await TaskModel.findById(currentId).select('blockedBy').lean();
            if (currentTask && currentTask.blockedBy) {
                for (const blockingId of currentTask.blockedBy) {
                    stack.push(blockingId.toString());
                }
            }
        }

        return false;
    }

    public async addDependency(taskId: string, blockedByTaskId: string): Promise<ITask | null> {
        const cycle = await this.wouldCreateCycle(taskId, blockedByTaskId);
        if (cycle) {
            throw new Error('Adding this dependency would create a cycle.');
        }

        return await TaskModel.findByIdAndUpdate(
            taskId,
            { $addToSet: { blockedBy: new mongoose.Types.ObjectId(blockedByTaskId) } },
            { new: true }
        ).populate('blockedBy');
    }

    public async removeDependency(taskId: string, blockedByTaskId: string): Promise<ITask | null> {
        return await TaskModel.findByIdAndUpdate(
            taskId,
            { $pull: { blockedBy: new mongoose.Types.ObjectId(blockedByTaskId) } },
            { new: true }
        ).populate('blockedBy');
    }
}
