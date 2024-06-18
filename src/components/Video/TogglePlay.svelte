<script>
    import { playbackState } from "../../stores/playback";

    $: playing = $playbackState.playing;

    function togglePlay() {
        playbackState.update((state) => ({
            ...state,
            playing: !state.playing,
        }));
    }

    $: buttonLabel = () => (playing ? "Pause" : "Play");

    $: buttonClass = () => (playing ? "paused" : "playing");
</script>

<button id="toggle-play" class={buttonClass()} on:click={togglePlay}>
    {buttonLabel()}
</button>
