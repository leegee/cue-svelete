import { test, expect } from '@playwright/test';

test('Recording button adds events to timeline', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Wait for the page and components to load
    await page.waitForSelector('#cue-app');

    // Click the recording button twice (start and stop recording)
    await page.click('#cue-toggle'); // Start recording
    await page.waitForTimeout(2000); // Simulate 2 seconds of video playback
    await page.click('#cue-toggle'); // Stop recording

    // Wait for any asynchronous updates to the timeline
    await page.waitForTimeout(500);

    // Assert that the timelineEvents store now has 1 event
    const events = await page.evaluate(() => {
        const eventsJson = localStorage.getItem('timelineEvents');
        return JSON.parse(eventsJson!).events || [];
    });

    expect(events.length).toBe(1);

    // Optionally, assert more detailed properties of the event if needed
    const event = events[0];
    expect(event.start).toBeGreaterThan(0);
    expect(event.end).toBeGreaterThan(event.start);
});
