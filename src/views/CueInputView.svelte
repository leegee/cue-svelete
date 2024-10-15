<script>
  import VideoPlayer from "../components/Video.svelte";
  import CueGrid from "../components/CueGrid.svelte";
  import LoadSRT from "../components/LoadSRT.svelte";
  import SaveMIDI from "../components/SaveMIDI.svelte";
  import SaveSRT from "../components/SaveSRT.svelte";
  import SaveMusicXML from "../components/SaveMusicXML.svelte";
  import TimeDisplay from "../components/TimeDisplay.svelte";
  import AddCue from "../components/AddCue.svelte";

  export let videoUrl;
</script>

<section>
  <div id="video-and-controls">
    <VideoPlayer {videoUrl} />

    <div id="controls-container">
      <TimeDisplay />
      <AddCue />
    </div>
  </div>

  <div id="cue-grid">
    <CueGrid />
  </div>

  <footer>
    <LoadSRT />
    <SaveSRT />
    <SaveMIDI />
    <SaveMusicXML />
  </footer>
</section>

<style>
  section {
    height: 100vh;
  }

  #cue-grid {
    height: calc(75vh - 32pt);
  }

  #video-and-controls {
    height: 25vh;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }

  #controls-container {
    display: flex;
    align-items: stretch;
    flex-direction: column;
  }

  footer {
    height: 32pt;
    width: auto;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    font-size: small;
  }
</style>
