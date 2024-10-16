# `cue-svelte`

[This little app](https://leegee.github.io/cue-svelete/) is an aid to spotting cues for film scores.

The user supplies a video, and as it plays, can click to add cue markers.

These can then be exported as an SRT subittle file.

Code is included, but not used, to render MIDI, but Cubase can't use MIDI lyrics despite 20 years of user requests.

Code is also included to write MusicXML, but output is not yet validated.

## Installation

    # npm install --legacy-peer-deps
    bun install
    bun run dev

## To Do

1. Vimeo
1. Rumble
1. Display cues as for NewThinkingAllowed

## YT Test Video

http://localhost:5173/?https://www.youtube.com/watch?v=_gDJHxydwBc

