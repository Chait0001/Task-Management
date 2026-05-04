export class DateParser {
    public static parse(input: string): Date | null {
        const lower = input.toLowerCase().trim();
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (lower === 'today' || lower === 'tdy') {
            return today;
        }

        if (lower === 'tomorrow' || lower === 'tmr' || lower === 'tmrw') {
            const tmr = new Date(today);
            tmr.setDate(tmr.getDate() + 1);
            return tmr;
        }

        // "in X days"
        const inDaysMatch = lower.match(/^in\s+(\d+)\s+days?$/);
        if (inDaysMatch) {
            const days = parseInt(inDaysMatch[1], 10);
            const target = new Date(today);
            target.setDate(target.getDate() + days);
            return target;
        }

        // "next <Day>"
        const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const nextDayMatch = lower.match(/^next\s+([a-z]+)$/);
        if (nextDayMatch) {
            const targetDayStr = nextDayMatch[1];
            const targetDayIdx = daysOfWeek.indexOf(targetDayStr);
            if (targetDayIdx !== -1) {
                const currentDayIdx = today.getDay();
                let daysToAdd = targetDayIdx - currentDayIdx;
                if (daysToAdd <= 0) {
                    daysToAdd += 7; // It's next week
                }
                const target = new Date(today);
                target.setDate(target.getDate() + daysToAdd);
                return target;
            }
        }

        if (lower === 'eow') { // End of week (Friday)
            const currentDayIdx = today.getDay();
            let daysToAdd = 5 - currentDayIdx; // Friday is 5
            if (daysToAdd <= 0) daysToAdd += 7;
            const target = new Date(today);
            target.setDate(target.getDate() + daysToAdd);
            return target;
        }

        if (lower === 'eom') { // End of month
            return new Date(today.getFullYear(), today.getMonth() + 1, 0);
        }

        // "DD/MM/YYYY" or "DD-MM-YYYY"
        const dmYMatch = lower.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
        if (dmYMatch) {
            const day = parseInt(dmYMatch[1], 10);
            const month = parseInt(dmYMatch[2], 10) - 1;
            const year = parseInt(dmYMatch[3], 10);
            return new Date(year, month, day);
        }

        // Fallback to standard date parsing
        const parsed = new Date(input);
        if (!isNaN(parsed.getTime())) {
            return parsed;
        }

        return null;
    }
}
