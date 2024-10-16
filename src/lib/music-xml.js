export function generateMusicXML ( cues ) {
    const xmlParts = [];

    xmlParts.push( '<?xml version="1.0" encoding="UTF-8" standalone="no"?>' );
    xmlParts.push( '<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">' );
    xmlParts.push( '<score-partwise version="3.1">' );
    xmlParts.push( '<part-list><score-part id="P1"><part-name>Music</part-name></score-part></part-list>' );
    xmlParts.push( '<part id="P1">' );

    const divisionsPerQuarterNote = 4;
    let currentMeasure = 1;

    cues.forEach( cue => {
        const startDiv = secondsToDivisions( cue.start, divisionsPerQuarterNote );
        const endDiv = secondsToDivisions( cue.end, divisionsPerQuarterNote );
        let durationDiv = endDiv - startDiv;

        xmlParts.push( `<measure number="${ currentMeasure }">` );
        xmlParts.push( '<attributes><divisions>4</divisions><key><fifths>0</fifths><mode>major</mode></key><time><beats>4</beats><beat-type>4</beat-type></time></attributes>' );
        xmlParts.push( '<note>' );
        xmlParts.push( '<pitch><step>C</step><octave>4</octave></pitch>' );
        xmlParts.push( `<duration>${ durationDiv }</duration>` );
        xmlParts.push( '<type>quarter</type>' );
        xmlParts.push( `<lyric><text>${ cue.content }</text></lyric>` );
        xmlParts.push( '</note>' );
        xmlParts.push( '</measure>' );
        currentMeasure++;
    } );

    xmlParts.pop();

    // Close part and score
    xmlParts.push( '</part>' );
    xmlParts.push( '</score-partwise>' );

    return xmlParts.join( '\n' );
}

function secondsToDivisions ( seconds, divisionsPerQuarterNote ) {
    return Math.round( seconds * divisionsPerQuarterNote );
}
