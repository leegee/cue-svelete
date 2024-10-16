// @ts-nocheck

export function generateMusicXML ( cues ) {
    const xmlParts = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<score-partwise version="3.1">',
        '    <part id="P1">'
    ];

    let measureNumber = 1;
    let measureContent = '';

    cues.forEach( ( cue ) => {
        // Create a measure for each cue
        measureContent += `        <measure number="${ measureNumber }">\n`;
        measureContent += `            <attributes>\n`;
        measureContent += `                <divisions>1</divisions>\n`; // Assume a division of 1 for simplicity
        measureContent += `                <time>\n`;
        measureContent += `                    <beats>${ cue.end - cue.start + 1 }</beats>\n`;
        measureContent += `                    <beat-type>4</beat-type>\n`;
        measureContent += `                </time>\n`;
        measureContent += `                <clef>\n`;
        measureContent += `                    <sign>G</sign>\n`;
        measureContent += `                    <line>2</line>\n`;
        measureContent += `                </clef>\n`;
        measureContent += `            </attributes>\n`;

        // Optionally, add cue content as lyrics or comments
        measureContent += `            <note>\n`;
        measureContent += `                <rest/>\n`; // Represent cue as a rest for simplicity
        measureContent += `                <lyric>\n`;
        measureContent += `                    <text>${ cue.content }</text>\n`;
        measureContent += `                </lyric>\n`;
        measureContent += `            </note>\n`;

        measureContent += `        </measure>\n`;
        measureNumber++;
    } );

    xmlParts.push( measureContent );
    xmlParts.push( '    </part>' );
    xmlParts.push( '</score-partwise>' );

    return xmlParts.join( '\n' );
}
