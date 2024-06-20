// stores/video-url.js
import { writable } from 'svelte/store';

export const videoUrl = writable( "" );

function isValidUrl ( url ) {
    try {
        new URL( url );
        return true;
    } catch ( error ) {
        return false;
    }
}

// Initialize videoUrl based on the current URL of the document
export function initializeVideoUrlFromDocument () {
    const currentUrl = window.location.search ? decodeURI( window.location.search.substring( 1 ) ) : "";
    if ( isValidUrl( currentUrl ) ) {
        videoUrl.set( currentUrl );
    }
}
