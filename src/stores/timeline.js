// timeline.js
/*
    Contains the cues and the index of the current cue displayed
 */

import { get, writable } from 'svelte/store';

import { currentTime } from "../stores/current-time";

export const NO_CURRENT_CUE_INDEX = -1;

const initialState = {
    cues: [
        // test data until there is a loader
        { start: 1, end: 3, content: 'action' },
        { start: 4, end: 15, content: 'love' },
        { start: 24, end: 25, content: 'love' },
        { start: 34, end: 35, content: 'love' },
        { start: 44, end: 45, content: 'love' },
        { start: 54, end: 55, content: 'love' },
        { start: 64, end: 65, content: 'love' },
        { start: 74, end: 71, content: 'love' },
        { start: 84, end: 85, content: 'love' },
        { start: 94, end: 95, content: 'love' },
        { start: 104, end: 105, content: 'love' },
        { start: 114, end: 115, content: 'love' },
        { start: 124, end: 125, content: 'love' },
        { start: 134, end: 135, content: 'love' },
        { start: 144, end: 145, content: 'love' },
    ],
    currentCueIndex: NO_CURRENT_CUE_INDEX,
};

export const timeline = writable( initialState );

export function hasCurrentCue () {
    return get( timeline ).currentCueIndex !== NO_CURRENT_CUE_INDEX;
}

export function getCues () {
    let cues;
    timeline.subscribe( value => {
        cues = value.cues;
    } );
    return cues;
}

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

export function setCues ( cues ) {
    timeline.update( () => ( {
        cues,
        currentCueIndex: 0,
    } ) );
}

export function setCurrentCue ( currentTimeValue ) {
    currentTime.set( currentTimeValue );

    timeline.update( ( state ) => {
        const { cues, currentCueIndex } = state;
        let nextCueIndex = currentCueIndex + 1;

        while (
            nextCueIndex < cues.length &&
            currentTimeValue >= cues[ nextCueIndex ].end
        ) {
            nextCueIndex++;
        }

        if ( nextCueIndex < cues.length ) {
            if (
                ( currentCueIndex !== NO_CURRENT_CUE_INDEX && currentTimeValue >= cues[ currentCueIndex ].end ) ||
                ( currentTimeValue >= cues[ nextCueIndex ].start && currentTimeValue < cues[ nextCueIndex ].end )
            ) {
                return { ...state, currentCueIndex: nextCueIndex };
            }
            if ( currentCueIndex !== NO_CURRENT_CUE_INDEX && currentTimeValue > cues[ currentCueIndex ].end ) {
                return { ...state, currentCueIndex: NO_CURRENT_CUE_INDEX };
            }
        }

        console.log( "currentCueIndex", currentCueIndex );
        return state;
    } );
}
