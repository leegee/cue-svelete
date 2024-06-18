<script>
    import "video.js/dist/video-js.css";

    import { onMount, onDestroy } from "svelte";
    import videojs from "video.js";
    import "videojs-youtube";
    import { currentTime } from "../stores/current-time";
    import { timeline } from "../stores/timeline";
    import { playbackState } from "../stores/playback.js";

    export let videoUrl;

    let videoElement;
    let player;
    let videoUrlSubscription;

    const { subscribe } = playbackState;

    function initializePlayer(url) {
        if (!url) {
            throw new Error("No url");
        }
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

        player.on("play", () => {
            playbackState.set({ playing: true });
        });

        player.on("pause", () => {
            playbackState.set({ playing: false });
        });

        player.on("timeupdate", onTimeUpdate);

        subscribe((state) => {
            if (state.playing) {
                player.play();
            } else {
                player.pause();
            }
        });
    }

    function onTimeUpdate() {
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
    }

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
        class="video-js vjs-default-skin"
        width="640"
        height="256"
        controls
        bind:this={videoElement}
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
