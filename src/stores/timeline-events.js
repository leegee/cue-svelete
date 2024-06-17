// timeline-events.js
import { writable } from 'svelte/store';

const initialState = {
    events: [
        { start: 1, end: 3, content: 'Subtitle from 1s to 3s' },
        { start: 4, end: 15, content: 'Subtitle from 4s to 15s' },
    ],
    currentEventIndex: -1,
};

export const timelineEvents = writable( initialState );
