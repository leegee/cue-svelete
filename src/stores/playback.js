// stores/playback.js
import { writable } from 'svelte/store';

const initialState = {
    playing: false,
};

export const playbackState = writable( initialState );
