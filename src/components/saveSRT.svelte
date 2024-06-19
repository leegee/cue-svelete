<!-- SubtitleManager.svelte -->
<script>
    import { getCues } from "../stores/timeline.js";
    import { formatTime } from "../lib/format-time.js";

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

<button on:click={downloadSRT}>⇩ Subtitles</button>
