<script>
    import { setCues } from "../stores/timeline";
    let fileContent = null;
    let dialogOpen = false;

    function handleFileSelect(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            fileContent = event.target.result;
            const cues = parseSRT(fileContent);
            setCues(cues);
            closeDialog(); // Close the dialog after processing the file
        };

        reader.readAsText(file);
    }

    // Function to open the dialog
    function openDialog() {
        dialogOpen = true;
    }

    // Function to close the dialog
    function closeDialog() {
        dialogOpen = false;
    }

    // @return an array of cues
    function parseSRT(srtContent) {
        const srtBlocks = srtContent.trim().split(/\r?\n\s*\r?\n/);

        const cues = srtBlocks.map((block) => {
            const lines = block.trim().split(/\r?\n/);
            const id = parseInt(lines[0]);
            const [start, end] = lines[1].split(" --> ").map((time) => {
                const [hhmmss, ms] = time.split(",");
                return (
                    parseInt(hhmmss.split(":")[0]) * 3600 +
                    parseInt(hhmmss.split(":")[1]) * 60 +
                    parseInt(hhmmss.split(":")[2]) +
                    parseFloat("0." + ms)
                );
            });
            const content = lines.slice(2).join("\n");
            return { id, start, end, content };
        });

        return cues;
    }
</script>

<button on:click={openDialog}> ⇧ Upload Subtitles </button>

<dialog open={dialogOpen} on:close={closeDialog}>
    <div class="content">
        <h2>Upload Subtitles</h2>
        <input type="file" accept=".srt" on:change={handleFileSelect} />
        <button on:click={closeDialog}>Cancel</button>
    </div>
</dialog>

<style>
    dialog {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        border: none;
    }

    dialog .content {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
    }
</style>
