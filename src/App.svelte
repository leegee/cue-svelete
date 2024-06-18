<script>
  import { writable } from "svelte/store";
  import VideoPlayer from "./components/Video.svelte";
  import Grid from "./components/CueGrid.svelte";
  import SaveSRT from "./components/saveSRT.svelte";
  import SaveMIDI from "./components/saveMIDI.svelte";

  const videoUrl = writable("");

  let pendingUrl = "";

  const handleUrlSubmit = () => {
    videoUrl.set(pendingUrl);
  };
</script>

<main id="cue-app">
  {#if !$videoUrl}
    <h1>Spotting Cues</h1>
    <div>
      <!-- svelte-ignore a11y-autofocus -->
      <input
        autofocus
        type="text"
        placeholder="Enter YouTube URL"
        bind:value={pendingUrl}
      />
      <button on:click={handleUrlSubmit}>Load Video</button>
    </div>
  {/if}

  {#if $videoUrl}
    <VideoPlayer {videoUrl} />
    <Grid />
    <p>
      <SaveSRT />
      <SaveMIDI />
    </p>
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
    font-size: 300%;
    margin-bottom: 1em;
  }

  input,
  button {
    font-size: large;
    padding: 1em;
  }
</style>
