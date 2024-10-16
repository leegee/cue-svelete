// @ts-nocheck

import { writeMidi } from 'midi-file';

function createDataUrlFromBytes ( bytes, mimeType ) {
    const base64String = btoa( String.fromCharCode( ...bytes ) );
    return `data:${ mimeType };base64,${ base64String }`;
}

function createMetaEvent ( type, text, deltaTime ) {
    return {
        deltaTime,
        meta: true,
        type: 'text', // This will be dynamically adjusted below
        subtype: type, // 'text', 'lyric', or 'cuePoint'
        text
    };
}

// Function to generate a MIDI file from cues
export function generateMIDIFile ( cues ) {
    const header = {
        format: 1, // MIDI format type 1 (multiple tracks)
        numTracks: 1,
        ticksPerBeat: 120 // 120 ticks per quarter note
    };

    const track = [];

    // Add a tempo meta-event (optional, adjust as necessary)
    track.push( {
        deltaTime: 0,
        meta: true,
        type: 'setTempo',
        microsecondsPerBeat: 500000 // 120 BPM (500,000 microseconds per beat)
    } );

    let lastTicks = 0;

    // Iterate over cues to add lyrics, cue points, and text
    cues.forEach( cue => {
        const { start, end, content, cuePoint } = cue;

        // Convert start time from seconds to ticks
        const startTicks = start * 120;
        const deltaTicks = startTicks - lastTicks;
        lastTicks = startTicks;

        // Add lyrics
        if ( content ) {
            track.push( createMetaEvent( 'lyric', content, deltaTicks ) );
        }

        // Add cue point
        if ( cuePoint ) {
            track.push( createMetaEvent( 'cuePoint', cuePoint, deltaTicks ) );
        }
    } );

    // Add track end event
    track.push( {
        deltaTime: 0,
        meta: true,
        type: 'endOfTrack'
    } );

    // Create a MIDI file with a single track
    const midiFile = {
        header,
        tracks: [ track ]
    };

    // Convert the file to binary MIDI data
    const midiBytes = writeMidi( midiFile );

    // Return the data URL
    const mimeType = 'audio/midi';
    return createDataUrlFromBytes( midiBytes, mimeType );
}
