// midi.test.js

import { generateMIDIFile } from './midi'; // Adjust the import path as needed

describe( 'generateMIDIFile', () => {
    it( 'should generate a valid MIDI data URL from cues', () => {
        // Example cues
        const cues = [
            { start: 0, end: 1, content: 'First lyric', cuePoint: 'Cue 1' },
            { start: 1, end: 2, content: 'Second lyric', cuePoint: 'Cue 2' },
        ];

        // Generate the MIDI data URL
        const midiDataUrl = generateMIDIFile( cues );

        // Check if the returned data URL starts with the correct MIME type
        expect( midiDataUrl ).toMatch( /^data:audio\/midi;base64,/ );

        // Optional: Check for a valid base64 string (this is just an example; you may want to do more checks)
        const base64Part = midiDataUrl.split( ',' )[ 1 ];
        expect( base64Part ).toBeTruthy();
        expect( base64Part.length ).toBeGreaterThan( 0 );
    } );
} );
