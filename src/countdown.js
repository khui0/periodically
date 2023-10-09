export function timeUntil(date) {
    date = Date.parse(date) || date;
    const milliseconds = date - Date.now();
    const seconds = Math.floor(Math.abs(milliseconds / 1000));
    const minutes = Math.floor(Math.abs(seconds / 60));
    const hours = Math.floor(Math.abs(minutes / 60));
    const days = Math.floor(Math.abs(hours / 24));
    return {
        days: days,
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60,
        passed: milliseconds < 0,
    };
}