<script>
  import { writable } from "svelte/store";
  import VideoPlayer from "./components/Video.svelte";
  import AddCue from "./components/AddCue.svelte";
  import Grid from "./components/CueGrid.svelte";

  const videoUrl = writable("");

  let pendingUrl = "";

  const handleUrlSubmit = () => {
    videoUrl.set(pendingUrl);
  };
</script>

<main id="cue-app">
  <h1>Vite + Svelte</h1>
  {#if !$videoUrl}
    <div>
      <input
        type="text"
        placeholder="Enter YouTube URL"
        bind:value={pendingUrl}
      />
      <button on:click={handleUrlSubmit}>Load Video</button>
    </div>
  {/if}

  {#if $videoUrl}
    <VideoPlayer {videoUrl} />
    <AddCue />
    <Grid />
  {/if}
</main>

<style>
  #cue-app {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }

  h1 {
    font-size: 2em;
    margin-bottom: 20px;
  }

  VideoPlayer,
  AddCue,
  Grid {
    margin-bottom: 20px;
  }
</style>
