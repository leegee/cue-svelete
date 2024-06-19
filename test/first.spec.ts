import { test, expect } from '@playwright/test';

test('Recording button adds cues to timeline', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Wait for the page and components to load
    await page.waitForSelector('#cue-app');

    await page.locator('input[id="user-video-url"]').fill('https://www.youtube.com/watch?v=_gDJHxydwBc');

    await page.click('button[id="load-video-url"]');

    // Click the recording button twice (start and stop recording)
    await page.click('#cue-toggle-button'); // Start recording
    await page.waitForTimeout(2000); // Simulate 2 seconds of video playback
    await page.click('#cue-toggle-button'); // Stop recording

    // Wait for any asynchronous updates to the timeline
    await page.waitForTimeout(500);

    // Assert that the timeline store now has 1 cue
    const cues = await page.evaluate(() => {
        const cuesJson = localStorage.getItem('timeline');
        return JSON.parse(cuesJson!).cues || [];
    });

    expect(cues.length).toBe(1);

    // Optionally, assert more detailed properties of the event if needed
    const cue = cues[0];
    expect(cue.start).toBeGreaterThan(0);
    expect(cue.end).toBeGreaterThan(cues.start);
});
