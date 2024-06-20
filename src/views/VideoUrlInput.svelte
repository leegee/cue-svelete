<!-- ./views/VideoUrlInput.svelte -->
<script>
    import { onMount } from "svelte";
    import {
        initializeVideoUrlFromDocument,
        videoUrl,
    } from "../stores/video-url";

    let pendingUrl = "";

    const handleUrlSubmit = () => {
        videoUrl.set(pendingUrl);
    };

    onMount(() => {
        initializeVideoUrlFromDocument();
    });
</script>

<section id="get-url">
    <header>
        <h1>Spotting Cues</h1>
    </header>
    <!-- svelte-ignore a11y-autofocus -->
    <input
        id="user-video-url"
        autofocus
        type="text"
        placeholder="Enter YouTube URL"
        bind:value={pendingUrl}
    />
    <button id="load-video-url" on:click={handleUrlSubmit}>Load Video</button>
    <footer>
        You can skip this step by putting the video URL after a <q>?</q> in this
        page's URL.
    </footer>
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

    footer {
        position: absolute;
        bottom: 10vh;
        opacity: 50%;
    }
</style>
