// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig( {
    test: {
        globals: true, // Enable global test functions
        environment: 'jsdom', // Use jsdom if you're testing in a browser-like environment
    },
} );
