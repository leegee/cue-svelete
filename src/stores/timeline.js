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
    timeline.update( allCues => {
        // Create a new array of cues with the new cue added and sorted by start time
        const newCues = [
            ...allCues.cues,
            {
                start: Number( start ),
                end: Number( end ),
                content: String( content )
            }
        ].sort( ( a, b ) => a.start - b.start );

        return {
            ...allCues,
            cues: newCues,
        };
    } );

    localStorage.setItem( 'timeline', JSON.stringify( getCues() ) );
}

export function getCues () {
    let cues;
    timeline.subscribe( value => {
        cues = value.cues;
    } );
    return cues;
}
