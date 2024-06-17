<script>
    import { currentTime } from "../stores/current-time";

    const logCurrentTime = () => {
        console.log("Current Time:", $currentTime, "seconds");
    };
</script>

<button on:click={logCurrentTime}>Log Current Time</button>

<style>
    /* Your button styles here */
</style>
