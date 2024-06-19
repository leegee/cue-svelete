<script>
    import { timeline } from "../stores/timeline";
    import VideoPlayer from "../components/Video.svelte";
    import Grid from "../components/CueGrid.svelte";
    import SaveSRT from "../components/saveSRT.svelte";
    import TimeDisplay from "../components/TimeDisplay.svelte";
    import AddCue from "../components/AddCue.svelte";

    export let videoUrl;
</script>

<VideoPlayer {videoUrl} />

<p id="controls-container">
    <AddCue />
    <TimeDisplay />
</p>

{#if $timeline.currentCueIndex > -1}
    <div id="current-cue-container">
        <p>{$timeline.cues[$timeline.currentCueIndex].content}</p>
    </div>
{/if}

<Grid />
<p>
    <SaveSRT />
</p>

<style>
    #controls-container {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }

    #current-cue-container {
        min-height: 1rem;
    }
</style>
