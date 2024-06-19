<script>
    import VideoPlayer from "../components/Video.svelte";
    import Grid from "../components/CueGrid.svelte";
    import SaveSRT from "../components/saveSRT.svelte";

    export let videoUrl;
</script>

<VideoPlayer {videoUrl} />
<Grid />
<p>
    <SaveSRT />
</p>
