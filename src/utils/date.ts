import dayjs, {Dayjs} from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Europe/Brussels');

export function shortPrettyDate(date: Date) {
    return date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        year: '2-digit',
        day: 'numeric',
    });
}

export function longPrettyDate(date: Date) {
    return date.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        year: 'numeric',
        day: 'numeric',
    });
}

export function longNumericDateTime(date: Date) {
    const dateStr = date.toLocaleDateString(undefined, {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
    });
    const timeStr = date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    });
    return `${dateStr} ${timeStr}`;
}

export function shortTime(date: Date) {
    return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function combineDateAndTimeISO(date: Dayjs, time: Dayjs) {
    return time
        .set('year', date.year())
        .set('month', date.month())
        .set('date', date.date())
        .set('second', 0)
        .set('millisecond', 0)
        .format('YYYY-MM-DD[T]HH:mm:ss');
}