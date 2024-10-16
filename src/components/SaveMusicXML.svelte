<script>
    import { generateMusicXML } from "../lib/music-xml";
    import { getCues } from "../stores/timeline.js";

    async function handleDownloadXML() {
        const cues = getCues();
        if (!cues || cues.length === 0) {
            console.warn("No cues defined");
            return;
        }

        const musicXMLContent = generateMusicXML(cues);

        console.log(musicXMLContent);

        // Create a Blob from the MusicXML content
        const blob = new Blob([musicXMLContent], { type: "text/xml" });

        // Create a URL for the Blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a hidden <a> element to trigger the download
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = blobUrl;
        a.download = "lyrics.xml";

        // Append the <a> element to the body and click on it
        document.body.appendChild(a);
        a.click();

        // Clean up: Revoke the Blob URL and remove the <a> element
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
    }
</script>

<button on:click={handleDownloadXML}>⇩ XML</button>
