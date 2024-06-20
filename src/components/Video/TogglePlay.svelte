<script>
    import { isPlaying } from "../../stores/is-playing";

    function togglePlay() {
        $isPlaying = !$isPlaying;
    }

    $: buttonLabel = () => ($isPlaying ? "Pause" : "Play");
    $: buttonClass = () => ($isPlaying ? "paused" : "playing");
</script>

<button id="toggle-play" class={buttonClass()} on:click={togglePlay}>
    {buttonLabel()}
</button>
