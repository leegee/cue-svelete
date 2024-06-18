<script>
    import { onMount, onDestroy } from "svelte";
    import { currentTime } from "../stores/current-time";
    import { timeline } from "../stores/timeline";
    import videojs from "video.js";
    import "video.js/dist/video-js.css";
    import "videojs-youtube";

    export let videoUrl;

    let videoElement;
    let player;
    let videoUrlSubscription;

    const initializePlayer = (url) => {
        if (!videoElement) {
            console.error("No videoElement");
            return;
        }

        if (player) {
            player.dispose();
        }

        player = videojs(videoElement, {
            techOrder: ["youtube"],
            sources: [{ type: "video/youtube", src: url }],
        });

        player.on("timeupdate", () => {
            const currentTimeValue = player.currentTime();
            currentTime.set(currentTimeValue);

            timeline.update((state) => {
                const { cues, currentCueIndex: currentEventIndex } = state;
                let nextCueIndex = currentEventIndex + 1;

                while (
                    nextCueIndex < cues.length &&
                    currentTimeValue >= cues[nextCueIndex].end
                ) {
                    nextCueIndex++;
                }

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

    onMount(() => {
        videoUrlSubscription = videoUrl.subscribe(($videoUrl) => {
            if ($videoUrl && videoElement) {
                initializePlayer($videoUrl);
            }
        });
    });

    onDestroy(() => {
        if (player) {
            player.dispose();
        }
        videoUrlSubscription.unsubscribe();
    });
</script>

<div data-vjs-player>
    <!-- svelte-ignore a11y-media-has-caption -->
    <video
        bind:this={videoElement}
        class="video-js vjs-default-skin"
        controls
        width="640"
        height="256"
    ></video>
</div>

<p class="time-container">
    <span class="time-value">
        Time: {$currentTime.toFixed(2)}
    </span>
</p>

{#if $timeline.currentCueIndex !== -1}
    <div class="cue-container">
        <p>{$timeline.cues[$timeline.currentCueIndex].content}</p>
    </div>
{/if}

<style>
    .cue-container {
    }

    .time-container {
        font-size: normal;
    }

    .time-value {
        font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
            "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
    }
</style>
