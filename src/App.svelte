<!-- ./App.svelte-->
<script>
  import { videoUrl } from "./stores/video-url";
  import VideoUrlInput from "./views/VideoUrlInput.svelte";
  import CueInputView from "./views/CueInputView.svelte";
</script>

<main id="cue-app">
  {#if !$videoUrl}
    <VideoUrlInput />
  {:else}
    <CueInputView {videoUrl} />
  {/if}
</main>

<style>
  #cue-app {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
