const timers: Map<string, number> = new Map();

export const debounce = (key: string, timeout: number, fn: Function, params?: any[]) => {
    if (timers.has(key)) {
        window.clearTimeout(timers.get(key));
        timers.delete(key);
    }

    const tId = window.setTimeout(() => {
        fn(...(params || []));
        if (timers.has(key)) {
            timers.delete(key);
        }
    }, timeout);

    timers.set(key, tId);
}