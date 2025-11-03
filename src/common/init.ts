import axios from 'axios';

import fs from 'node:fs';
import path from 'node:path';

import grabCookies from './cookie.ts';

export const headers: { [key: string]: string } = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-US,en;q=0.9',
    'Priority': 'u=0, i',
    'Sec-Ch-Ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"macOS"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-site',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'Referer': 'https://www.blooket.com/',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome'
}

export default async () => {
    Object.keys(headers).forEach((header) => axios.defaults.headers.common[header] = headers[header]);

    const cookieFile = path.join(import.meta.dirname, '.cookie');
    while (!fs.existsSync(cookieFile)) {
        console.log('Bypassing Cloudflare AntiBot...');
        await grabCookies();
    }

    const cookies = fs.readFileSync(cookieFile, 'utf-8');
    axios.defaults.headers.common['cookie'] = cookies;
}