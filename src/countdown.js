function timeBetween(date) {
    let target = new Date(date).getTime();
    let milliseconds = target - Date.now();
    let seconds = Math.floor(Math.abs(milliseconds / 1000));
    let minutes = Math.floor(Math.abs(seconds / 60));
    let hours = Math.floor(Math.abs(minutes / 60));
    let days = Math.floor(Math.abs(hours / 24));
    return {
        days: days,
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60,
        passed: milliseconds < 0
    }
}