import { useState, useEffect, useRef } from 'react';
import { PomodoroTimer } from '../utils/PomodoroTimer';

export const useFocusMode = (durationMinutes: number = 25, onComplete?: () => void) => {
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [remainingMs, setRemainingMs] = useState(durationMinutes * 60 * 1000);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef<PomodoroTimer | null>(null);

    const start = () => {
        if (!timerRef.current) {
            timerRef.current = new PomodoroTimer(durationMinutes);
            timerRef.current.onTick = (ms) => {
                setRemainingMs(ms);
                setProgress(timerRef.current!.getProgress());
            };
            timerRef.current.onDone = () => {
                setIsActive(false);
                if (onComplete) onComplete();
            };
        }
        timerRef.current.start();
        setIsActive(true);
        setIsPaused(false);
    };

    const pause = () => {
        if (timerRef.current) {
            timerRef.current.pause();
            setIsPaused(true);
        }
    };

    const resume = () => {
        if (timerRef.current) {
            timerRef.current.resume();
            setIsPaused(false);
        }
    };

    const abandon = () => {
        if (timerRef.current) {
            timerRef.current.pause();
            timerRef.current = null;
        }
        setIsActive(false);
        setIsPaused(false);
        setRemainingMs(durationMinutes * 60 * 1000);
        setProgress(0);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                timerRef.current.pause();
            }
        };
    }, []);

    const minutes = Math.floor(remainingMs / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);
    const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return {
        isActive,
        isPaused,
        timeFormatted,
        progress,
        start,
        pause,
        resume,
        abandon
    };
};
