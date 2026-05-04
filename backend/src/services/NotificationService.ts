export class NotificationService {
  private static instance: NotificationService;
  private notifications: { taskId: string; message: string; createdAt: Date }[] = [];

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public notify(taskId: string, message: string): void {
    this.notifications.push({ taskId, message, createdAt: new Date() });
    console.log(`[Notification] Task ${taskId}: ${message}`);
  }

  public getAll(): { taskId: string; message: string; createdAt: Date }[] {
    return [...this.notifications];
  }

  public clearForTask(taskId: string): void {
    this.notifications = this.notifications.filter(n => n.taskId !== taskId);
  }
}
