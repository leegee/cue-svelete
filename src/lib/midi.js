// midi.js
import { getCues } from '../stores/timeline.js';

export function generateMIDIFile () {
    const cues = getCues();
    if ( !cues ) {
        console.warn( "No cues defined" );
        return;
    }
    const lyrics = cues.map( cue => ( {
        text: cue.content,
        duration: ( cue.end - cue.start ) * 480, // Convert seconds to ticks (assuming 480 ticks per quarter note)
    } ) );

    const header = new Uint8Array( [
        0x4D, 0x54, 0x68, 0x64, // Header chunk type
        0x00, 0x00, 0x00, 0x06, // Header chunk length
        0x00, 0x01, // Format type (1)
        0x00, 0x01, // Number of tracks (only one, for lyrics)
        0x00, 0x78, // Division (ticks per quarter note)
    ] );

    const trackHeader = new Uint8Array( [
        0x4D, 0x54, 0x72, 0x6B, // Track chunk type
        0x00, 0x00, 0x00, 0x00, // Placeholder for track chunk length
    ] );

    const events = generateLyricEvents( lyrics );
    const trackLength = events.length + 4; // +4 for the track header length

    trackHeader[ 4 ] = ( trackLength >> 24 ) & 0xFF;
    trackHeader[ 5 ] = ( trackLength >> 16 ) & 0xFF;
    trackHeader[ 6 ] = ( trackLength >> 8 ) & 0xFF;
    trackHeader[ 7 ] = trackLength & 0xFF;

    const headerBlob = new Blob( [ header ], { type: 'audio/midi' } );
    const trackHeaderBlob = new Blob( [ trackHeader ], { type: 'audio/midi' } );
    const eventsBlob = new Blob( [ events ], { type: 'audio/midi' } );

    const blobs = [ headerBlob, trackHeaderBlob, eventsBlob ];
    const midiBlob = new Blob( blobs, { type: 'audio/midi' } );

    const url = URL.createObjectURL( midiBlob );
    return url;
}

function generateLyricEvents ( lyrics ) {
    const events = [];

    let deltaTime = 0;
    lyrics.forEach( lyric => {
        const textBytes = stringToBytes( lyric.text );

        const eventLength = textBytes.length + 1;
        const lengthBytes = encodeVariableLength( eventLength );

        // MIDI event for lyric
        events.push( 0x00 ); // Delta time (var-length)
        events.push( 0xFF ); // Meta event marker
        events.push( 0x05 ); // Lyric event type
        events.push( lengthBytes.length, ...lengthBytes ); // Length of the lyric text
        events.push( ...textBytes ); // The lyric text in bytes

        deltaTime += lyric.duration; // Adjust delta time based on the duration of the lyric
    } );

    return new Uint8Array( events );
}

function stringToBytes ( text ) {
    const bytes = [];
    for ( let i = 0; i < text.length; i++ ) {
        bytes.push( text.charCodeAt( i ) );
    }
    return bytes;
}

function encodeVariableLength ( value ) {
    const buffer = [];
    do {
        let byte = value & 0x7F;
        value >>>= 7;
        if ( value !== 0 ) {
            byte |= 0x80;
        }
        buffer.push( byte );
    } while ( value !== 0 );
    return buffer.reverse();
}
