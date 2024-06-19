// Format time as hh:mm:ss,mmm
export function formatTime ( seconds ) {
    const hours = Math.floor( seconds / 3600 );
    const minutes = Math.floor( ( seconds % 3600 ) / 60 );
    const secs = seconds % 60;
    const milliseconds = Math.round( ( seconds - Math.floor( seconds ) ) * 1000 );

    return `${ pad( hours ) }:${ pad( minutes ) }:${ pad( secs ) },${ pad( milliseconds, 3 ) }`;
}

function pad ( number, length = 2 ) {
    return ( "0" + number ).slice( -length );
}
