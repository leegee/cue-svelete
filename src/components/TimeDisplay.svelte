<script>
    import { currentTime } from "../stores/current-time";

    // Fastest, not prettiest
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        const milliseconds = Math.floor((seconds % 1) * 1000);

        const hoursString = (hours < 10 ? "0" : "") + hours;
        const minutesString = (minutes < 10 ? "0" : "") + minutes;
        const secondsString = (secs < 10 ? "0" : "") + secs;
        const millisecondsString =
            (milliseconds < 100 ? (milliseconds < 10 ? "00" : "0") : "") +
            milliseconds;

        return `${hoursString}:${minutesString}:${secondsString},${millisecondsString}`;
    }
</script>

<span id="time-container">
    {formatTime($currentTime)}
</span>

<style>
    #time-container {
        margin-left: 1em;
        font-family: "Courier New", Courier, monospace;
        font-size: x-large;
        opacity: 50%;
    }
</style>
