// timeline.js
/*
    Contains the cues and the index of the current cue displayed
 */

import { writable } from 'svelte/store';

const initialState = {
    cues: [
        { start: 1, end: 3, content: 'Cue from 1s to 3s' },
        { start: 4, end: 15, content: 'Cue from 4s to 15s' },
    ],
    currentCueIndex: -1,
};

export const timeline = writable( initialState );

export function addCue ( start, end, content ) {
    timeline.update( cues => ( {
        ...cues,
        cues: [
            ...cues.cues,
            { start, end, content }
        ]
    } ) );

    localStorage.setItem( 'timeline', JSON.stringify( timeline ) );
}
