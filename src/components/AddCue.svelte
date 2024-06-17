<script>
    import { writable } from "svelte/store";
    import { currentTime } from "../stores/current-time";
    import { timeline, addCue } from "../stores/timeline";

    let isRecording = false;
    let startTime = null;
    let endTime = null;

    const toggleRecording = () => {
        if (!isRecording) {
            // Start recording
            startTime = $currentTime;
            console.log("Recording start time:", startTime);
        } else {
            // End recording
            endTime = $currentTime;
            console.log("Recording end time:", endTime);

            addCue(
                startTime,
                endTime,
                `Subtitle from ${startTime.toFixed(2)}s to ${endTime.toFixed(2)}s`,
            );
        }

        isRecording = !isRecording;
    };

    const buttonLabel = () => {
        return isRecording ? "Stop Recording" : "Start Recording";
    };

    const buttonClass = () => {
        return isRecording ? "recording" : "";
    };
</script>

<button id="cue-toggle" class={buttonClass()} on:click={toggleRecording}
    >{buttonLabel()}</button
>

<style>
    .recording {
        background-color: red;
        color: white;
    }
</style>
