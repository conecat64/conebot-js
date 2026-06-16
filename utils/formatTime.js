module.exports = function (totalSeconds, isPrecise) {
    let days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor((totalSeconds / 3600) % 24);
    let minutes = Math.floor((totalSeconds / 60) % 60);
    let seconds = Math.floor(totalSeconds % 60);
    let ms = Math.floor((totalSeconds % 1) * 100);

    let parts = [];

    if (!isPrecise) {
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        parts.push(`${seconds}s`);

        return parts.join(' ');

    } else {
        let secondsString = seconds.toString().padStart(2, '0') + '.';
        let msString = ms.toString().padStart(2, '0');

        parts.push(`${minutes}:`);
        parts.push(secondsString);
        parts.push(msString);

        return parts.join('');
    }
}