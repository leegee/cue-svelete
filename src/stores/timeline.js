// timeline.js
/*
    Contains the cues and the index of the current cue displayed
 */

import { writable } from 'svelte/store';

const initialState = {
    cues: [
        // test data until there is a loader
        { start: 1, end: 3, content: '' },
        { start: 4, end: 15, content: '' },
    ],
    currentCueIndex: -1,
};

export const timeline = writable( initialState );

export function addCue ( start, end, content ) {
    timeline.update( cues => ( {
        ...cues,
        cues: [
            ...cues.cues,
            {
                start: Number( start ),
                end: Number( end ),
                content: String( content )
            }
        ]
    } ) );

    localStorage.setItem( 'timeline', JSON.stringify( timeline ) );
}
