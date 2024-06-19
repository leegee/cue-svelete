<script>
    import "video.js/dist/video-js.css";

    import { onMount, onDestroy } from "svelte";
    import videojs from "video.js";
    import "videojs-youtube";
    import { setCurrentCue } from "../stores/timeline";
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

    // Keep the timeline.currentCueIndex synchronized with the video
    function onTimeUpdate() {
        setCurrentCue(player.currentTime());
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
