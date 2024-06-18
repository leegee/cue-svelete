<script>
    import { playbackState } from "../../stores/playback";

    $: playing = $playbackState.playing;

    function togglePlay() {
        playbackState.update((state) => ({
            ...state,
            playing: !state.playing,
        }));
    }

    const buttonLabel = () => (playing ? "Pause" : "Play");

    const buttonClass = () => (playing ? "paused" : "playing");
</script>

<button id="toggle-play" class={buttonClass()} on:click={togglePlay}>
    {buttonLabel()}
</button>
