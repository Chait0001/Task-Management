export class PomodoroTimer {
    private durationMs: number;
    private remainingMs: number;
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private lastTickTime: number = 0;
    
    public onTick?: (remainingMs: number) => void;
    public onDone?: () => void;

    constructor(durationMinutes: number = 25) {
        this.durationMs = durationMinutes * 60 * 1000;
        this.remainingMs = this.durationMs;
    }

    public start(): void {
        if (this.intervalId) return;
        this.lastTickTime = Date.now();
        this.intervalId = setInterval(() => this.tick(), 100); // 100ms for smooth UI updates
    }

    public pause(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.tick(); // final tick before pause
        }
    }

    public resume(): void {
        this.start();
    }

    public getRemainingMs(): number {
        return this.remainingMs;
    }
    
    public getProgress(): number {
        return 1 - (this.remainingMs / this.durationMs);
    }

    private tick(): void {
        const now = Date.now();
        const delta = now - this.lastTickTime;
        this.lastTickTime = now;
        
        this.remainingMs -= delta;

        if (this.remainingMs <= 0) {
            this.remainingMs = 0;
            this.pause();
            if (this.onDone) this.onDone();
        }

        if (this.onTick) {
            this.onTick(this.remainingMs);
        }
    }
}
