<script>
    import { currentTime } from "../stores/current-time";
    import { addCue } from "../stores/timeline";

    let isRecording = false;
    let startTime = null;
    let endTime = null;

    const toggleRecording = () => {
        if (!isRecording) {
            startTime = $currentTime;
            console.log("Recording start time:", startTime);
        } else {
            endTime = $currentTime;
            console.log("Recording end time:", endTime);

            addCue(
                startTime,
                endTime,
                "",
                // `Cue from ${startTime.toFixed(2)}s to ${endTime.toFixed(2)}s`,
            );
        }

        isRecording = !isRecording;
    };

    $: buttonLabel = () => (isRecording ? "End Cue" : "Start Cue");

    $: buttonClass = () => (isRecording ? "recording" : "waiting");
</script>

<button id="cue-toggle" class={buttonClass()} on:click={toggleRecording}
    >{buttonLabel()}</button
>

<style>
    #cue-toggle {
        color: white;
    }
    .waiting {
        background-color: green;
    }
    .recording {
        background-color: red;
    }
</style>
