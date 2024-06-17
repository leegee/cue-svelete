<!--  https://www.youtube.com/watch?v=euNdq37qSyg -->

<script>
    import { onMount, onDestroy } from "svelte";
    import { writable } from "svelte/store";
    import videojs from "video.js";
    import { currentTime } from "../stores/current-time";
    import { timelineEvents } from "../stores/timeline-events";

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

            // Check if there are events to display at the current time
            timelineEvents.update((state) => {
                const { events, currentEventIndex } = state;
                let nextEventIndex = currentEventIndex + 1;

                // Find the next event to display within its time interval
                while (
                    nextEventIndex < events.length &&
                    currentTimeValue >= events[nextEventIndex].end
                ) {
                    nextEventIndex++;
                }

                // Check if there is a new event to display
                if (
                    nextEventIndex < events.length &&
                    currentTimeValue >= events[nextEventIndex].start
                ) {
                    return { ...state, currentEventIndex: nextEventIndex };
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

{#if $timelineEvents.currentEventIndex !== -1}
    <!-- Display subtitle or other content based on current event -->
    <div class="subtitle-container">
        <p>
            {$timelineEvents.events[$timelineEvents.currentEventIndex].content}
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
