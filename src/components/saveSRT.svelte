<!-- SubtitleManager.svelte -->
<script>
    import { getCues } from "../stores/timeline.js";

    function generateSRTFromCues(cues) {
        let srtContent = "";

        cues.forEach((cue, index) => {
            const subtitleNumber = index + 1;
            const startTime = formatTime(cue.start);
            const endTime = formatTime(cue.end);
            const text = cue.content;

            srtContent += `${subtitleNumber}\n`;
            srtContent += `${startTime} --> ${endTime}\n`;
            srtContent += `${text}\n\n`;
        });

        return srtContent;
    }

    // Format time as hh:mm:ss,mmm
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        const milliseconds = Math.round((seconds - Math.floor(seconds)) * 1000);

        return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${pad(milliseconds, 3)}`;
    }

    function pad(number, length = 2) {
        return ("0" + number).slice(-length);
    }

    function downloadSRT() {
        const cues = getCues();
        const srtContent = generateSRTFromCues(cues);

        const blob = new Blob([srtContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "cues.srt";
        document.body.appendChild(a);

        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
</script>

<button on:click={downloadSRT}>Download SRT</button>
