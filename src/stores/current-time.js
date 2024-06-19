import { writable } from 'svelte/store';
export const currentTime = writable( 0 );

export const setPlayheadPosition = ( time ) => {
    currentTime.set( time );
};
