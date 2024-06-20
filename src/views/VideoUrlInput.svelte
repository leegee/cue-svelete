<!-- ./views/VideoUrlInput.svelte -->
<script>
    import { videoUrl } from "../stores/video-url";

    let pendingUrl = "https://www.youtube.com/watch?v=_gDJHxydwBc";

    const handleUrlSubmit = () => {
        videoUrl.set(pendingUrl);
    };
</script>

<section id="get-url">
    <h1>Spotting Cues</h1>
    <!-- svelte-ignore a11y-autofocus -->
    <input
        id="user-video-url"
        autofocus
        type="text"
        placeholder="Enter YouTube URL"
        bind:value={pendingUrl}
    />
    <button id="load-video-url" on:click={handleUrlSubmit}>Load Video</button>
</section>

<style>
    #get-url {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 33vh;
    }

    h1 {
        font-size: 300%;
        margin-bottom: 1em;
    }

    input,
    button {
        font-size: large;
        padding: 1em;
    }

    button {
        margin-top: 1em;
    }
</style>
