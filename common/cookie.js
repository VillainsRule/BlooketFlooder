import fs from 'node:fs';
import path from 'node:path';

import { connect } from 'puppeteer-real-browser';

const grabCookies = async () => {
    const { browser, page } = await connect({
        headless: false,
        args: [],
        customConfig: {},
        turnstile: true,
        connectOption: {},
        disableXvfb: false,
        ignoreAllFlags: false
    })

    await page.goto('https://goldquest.blooket.com');

    let cookieString = '';
    let cookies = await browser.cookies();

    cookies.forEach((cookie) => cookieString += `${cookie.name}=${cookie.value}; `);

    fs.writeFileSync(path.join(import.meta.dirname, '.cookie'), cookieString);

    await browser.close();
}

export default grabCookies;