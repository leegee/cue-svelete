<script>
    import { generateMIDIFile } from "../lib/midi.js";

    function handleDownloadMIDI() {
        const midiUrl = generateMIDIFile();
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = midiUrl;
        a.download = "lyrics.mid";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(midiUrl);
        document.body.removeChild(a);
    }
</script>

<button on:click={handleDownloadMIDI}>MIDI</button>
