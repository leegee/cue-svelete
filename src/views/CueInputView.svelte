<script>
    import VideoPlayer from "../components/Video.svelte";
    import Grid from "../components/CueGrid.svelte";
    import LoadSRT from "../components/LoadSRT.svelte";
    import SaveMIDI from "../components/SaveMIDI.svelte";
    import SaveSRT from "../components/SaveSRT.svelte";
    import TimeDisplay from "../components/TimeDisplay.svelte";
    import AddCue from "../components/AddCue.svelte";

    export let videoUrl;
</script>

<VideoPlayer {videoUrl} />

<p id="controls-container">
    <AddCue />
    <TimeDisplay />
</p>

<Grid />
<p>
    <LoadSRT />
    |
    <SaveSRT />
    <SaveMIDI />
</p>

<style>
    #controls-container {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }
</style>
