import { describe, it, expect } from 'vitest';

import { generateMusicXML } from './music-xml';

import libxmljs from 'libxmljs';
import fs from 'fs/promises';

const xsdPath = 'src/lib/musicxml-4.0/schema/musicxml.xsd';

async function validateXML ( xmlString, xsdPath ) {
    // Parse the XML string
    const xmlDoc = libxmljs.parseXml( xmlString );

    // Read the XSD file
    const xsdData = await fs.readFile( xsdPath, 'utf8' );
    const xsdDoc = libxmljs.parseXml( xsdData );

    // Validate XML against XSD
    const isValid = xmlDoc.validate( xsdDoc );

    if ( isValid ) {
        console.log( 'XML is valid.' );
    } else {
        console.error( 'XML is invalid. Errors:' );
        xmlDoc.validationErrors.forEach( error => console.error( error ) );
    }

    return isValid;
}

const normalizeXML = ( xmlString ) => {
    return xmlString
        .replace( /\s+/g, ' ' ) // Replace multiple whitespace characters with a single space
        .trim(); // Trim leading and trailing whitespace
};

describe( 'generateMusicXML', () => {
    it( 'should generate valid Music XML for given cues', async () => {
        const cues = [
            { start: 1, end: 3, content: "one to three" },
            { start: 4, end: 15, content: "four to 15" },
            { start: 24, end: 25, content: "24 to 25" },
            { start: 100, end: 104, content: "100 to 104" }
        ];

        const expectedXML = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="3.1">
    <part id="P1">
        <measure number="1">
            <attributes>
                <divisions>1</divisions>
                <time>
                    <beats>3</beats>
                    <beat-type>4</beat-type>
                </time>
                <clef>
                    <sign>G</sign>
                    <line>2</line>
                </clef>
            </attributes>
            <note>
                <rest/>
                <lyric>
                    <text>one to three</text>
                </lyric>
            </note>
        </measure>
        <measure number="2">
            <attributes>
                <divisions>1</divisions>
                <time>
                    <beats>12</beats>
                    <beat-type>4</beat-type>
                </time>
                <clef>
                    <sign>G</sign>
                    <line>2</line>
                </clef>
            </attributes>
            <note>
                <rest/>
                <lyric>
                    <text>four to 15</text>
                </lyric>
            </note>
        </measure>
        <measure number="3">
            <attributes>
                <divisions>1</divisions>
                <time>
                    <beats>2</beats>
                    <beat-type>4</beat-type>
                </time>
                <clef>
                    <sign>G</sign>
                    <line>2</line>
                </clef>
            </attributes>
            <note>
                <rest/>
                <lyric>
                    <text>24 to 25</text>
                </lyric>
            </note>
        </measure>
        <measure number="4">
            <attributes>
                <divisions>1</divisions>
                <time>
                    <beats>5</beats>
                    <beat-type>4</beat-type>
                </time>
                <clef>
                    <sign>G</sign>
                    <line>2</line>
                </clef>
            </attributes>
            <note>
                <rest/>
                <lyric>
                    <text>100 to 104</text>
                </lyric>
            </note>
        </measure>
    </part>
</score-partwise>`;

        const musicXMLContent = generateMusicXML( cues );
        const isValid = await validateXML( musicXMLContent, xsdPath );
        expect( isValid ).toBeTruthy();

        expect( normalizeXML( musicXMLContent ) ).toBe( normalizeXML( expectedXML ) );
    } );
} );
