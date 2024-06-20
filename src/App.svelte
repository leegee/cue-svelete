<script>
  import { writable } from "svelte/store";
  import CueInputView from "./views/CueInputView.svelte";

  const videoUrl = writable("");

  let pendingUrl = "";

  const handleUrlSubmit = () => {
    videoUrl.set(pendingUrl);
  };
</script>

<main id="cue-app">
  {#if !$videoUrl}
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
  {/if}

  {#if $videoUrl}
    <CueInputView {videoUrl} />
  {/if}
</main>

<style>
  #cue-app {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }

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
