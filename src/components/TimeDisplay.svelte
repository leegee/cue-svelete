<script>
    import { currentTime } from "../stores/current-time";
</script>

<span id="time-container">
    Time: <span id="time-value">
        {$currentTime.toFixed(2)}
    </span>
</span>

<style>
    #time-container {
        margin-left: 1em;
    }

    #time-value {
        font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
            "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
    }
</style>
