<script>
    import VideoPlayer from "../components/Video.svelte";
    import CueGrid from "../components/CueGrid.svelte";
    import LoadSRT from "../components/LoadSRT.svelte";
    import SaveMIDI from "../components/SaveMIDI.svelte";
    import SaveSRT from "../components/SaveSRT.svelte";
    import TimeDisplay from "../components/TimeDisplay.svelte";
    import AddCue from "../components/AddCue.svelte";

    export let videoUrl;
</script>

<section>
    <div id="video-and-controls">
        <VideoPlayer {videoUrl} />

        <div id="controls-container">
            <AddCue />
            <TimeDisplay />
        </div>
    </div>

    <div id="cue-grid">
        <CueGrid />
    </div>

    <footer>
        <LoadSRT />
        <SaveSRT />
        <SaveMIDI />
    </footer>
</section>

<style>
    section {
        height: 100vh;
    }

    #cue-grid {
        height: calc(75vh - 32pt);
    }

    #video-and-controls {
        height: 25vh;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }

    #controls-container {
        display: flex;
        align-items: stretch;
        flex-direction: column;
    }

    footer {
        position: absolute;
        bottom: 0;
        height: 32pt;
        width: auto;
        left: 50%;
        transform: translate(-50%, 0);
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        font-size: small;
    }
</style>
