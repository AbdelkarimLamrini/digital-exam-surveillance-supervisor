export function prettyDate(date: Date) {
    return date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        year: '2-digit',
        day: 'numeric',
    });
}

export function shortTime(date: Date) {
    return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    });
}