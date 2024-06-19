<script>
    import "video.js/dist/video-js.css";

    import { onMount, onDestroy } from "svelte";
    import videojs from "video.js";
    import "videojs-youtube";
    import { setCurrentCue } from "../stores/timeline";
    import { newTime } from "../stores/new-time";
    import { isPlaying } from "../stores/is-playing.js";
    import { currentTime } from "../stores/current-time";

    export let videoUrl;

    let videoElement;
    let player;
    let videoUrlSubscription;

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

        player.on("play", () => ($isPlaying = true));

        player.on("pause", () => ($isPlaying = false));

        // Keep the timeline.currentCueIndex synchronized with the video
        // Videojs fires timeupdate at regular intervals, regardless on whether or not the time has been updated.
        let lastTimeSeen = 0;
        player.on("timeupdate", () => {
            const playerCurrentTime = player.currentTime();
            if (playerCurrentTime !== lastTimeSeen) {
                console.log(
                    "player time changed, call for update of currentCue",
                    playerCurrentTime,
                );
                $currentTime = playerCurrentTime;
                setCurrentCue(playerCurrentTime);
                lastTimeSeen = playerCurrentTime;
            }
        });

        isPlaying.subscribe((state) => {
            if (state) {
                player.play();
            } else {
                player.pause();
            }
        });

        newTime.subscribe((newTimeValue) => {
            $currentTime = newTimeValue;
            player.currentTime(newTimeValue);
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
