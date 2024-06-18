// timeline.js
/*
    Contains the cues and the index of the current cue displayed
 */

import { writable } from 'svelte/store';

const initialState = {
    cues: [
        // test data until there is a loader
        { start: 1, end: 3, content: 'action' },
        { start: 4, end: 15, content: 'love' },
    ],
    currentCueIndex: -1,
};

export const timeline = writable( initialState );

function badValues ( start, end, content ) {
    if ( start >= end ) {
        alert( "The start value must be smaller than the end value" );
        return true;
    }

    if ( start < 0 || end < 0 ) {
        alert( "The start value must be smaller than the end value" );
        return true;
    }

    return false;
}

function storeLocally () {
    localStorage.setItem( 'timeline', JSON.stringify( getCues() ) );
}

export function updateCue ( index, start, end, content ) {
    console.log( { index, start, end, content } )
    if ( badValues( start, end, content ) ) {
        throw new Error( 'Bad values' );
    }

    timeline.update( allCues => {
        // Ensure index is within bounds
        if ( index < 0 || index >= allCues.cues.length ) {
            console.error( `Invalid index ${ index } provided for updateCue` );
            return allCues;
        }

        const updatedCues = [ ...allCues.cues ];

        // Update the cue at the specified index
        updatedCues[ index ] = {
            start: Number( start ),
            end: Number( end ),
            content: String( content )
        };

        updatedCues.sort( ( a, b ) => a.start - b.start );

        return {
            ...allCues,
            cues: updatedCues
        };
    } );

    storeLocally();
}

export function addCue ( start, end, content ) {
    if ( badValues( start, end, content ) ) {
        return;
    }

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

    storeLocally();
}

export function getCues () {
    let cues;
    timeline.subscribe( value => {
        cues = value.cues;
    } );
    return cues;
}
