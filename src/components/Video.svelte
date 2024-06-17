<!--  https://www.youtube.com/watch?v=euNdq37qSyg -->

<script>
    import { onMount, onDestroy } from "svelte";
    import { writable } from "svelte/store";
    import videojs from "video.js";
    import { currentTime } from "../stores/current-time";
    import { timeline } from "../stores/timeline";

    import "video.js/dist/video-js.css";
    import "videojs-youtube";

    let videoElement;
    let videoUrl = writable("");
    let player;
    let pendingUrl = "";

    const initializePlayer = (url) => {
        videoUrl.set(url);

        console.log("Initializing player with URL:", url);

        if (player) {
            player.dispose();
        }

        player = videojs(videoElement, {
            techOrder: ["youtube"],
            sources: [
                {
                    type: "video/youtube",
                    src: url,
                },
            ],
        });

        // Track playhead position
        player.on("timeupdate", () => {
            const currentTimeValue = player.currentTime();
            currentTime.set(currentTimeValue);

            // Check if there are cues to display at the current time
            timeline.update((state) => {
                const { cues, currentCueIndex: currentEventIndex } = state;
                let nextCueIndex = currentEventIndex + 1;

                // Find the next event to display within its time interval
                while (
                    nextCueIndex < cues.length &&
                    currentTimeValue >= cues[nextCueIndex].end
                ) {
                    nextCueIndex++;
                }

                // Check if there is a new event to display
                if (
                    nextCueIndex < cues.length &&
                    currentTimeValue >= cues[nextCueIndex].start
                ) {
                    return { ...state, currentCueIndex: nextCueIndex };
                }

                return state;
            });
        });
    };

    const handleSubmit = () => initializePlayer(pendingUrl);

    onDestroy(() => {
        if (player) {
            player.dispose();
        }
    });

    // Subscribe to changes in videoUrl for debugging
    $: console.log("Current videoUrl:", $videoUrl);
</script>

<div data-vjs-player>
    <video
        bind:this={videoElement}
        class="video-js vjs-default-skin"
        controls
        width="640"
        height="256"
    ></video>
</div>

<p>Current Playhead Position: {$currentTime.toFixed(2)} seconds</p>

{#if !$videoUrl}
    <div>
        <input
            type="text"
            placeholder="Enter YouTube URL"
            bind:value={pendingUrl}
        />
        <button on:click={handleSubmit}>Load Video</button>
    </div>
{/if}

{#if $timeline.currentCueIndex !== -1}
    <!-- Display subtitle or other content based on current event -->
    <div class="subtitle-container">
        <p>
            {$timeline.cues[$timeline.currentCueIndex].content}
        </p>
    </div>
{/if}

<style>
    .subtitle-container {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px;
        border-radius: 5px;
    }
</style>
