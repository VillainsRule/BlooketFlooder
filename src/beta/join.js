import FormData from 'form-data';
import WebSocket from 'ws';

import createClient from '../common/createClient.js';

import { green, red } from '../common/color.js';

export default async (config, cfV2Res, i) => new Promise(async (cb) => {
    const { cookies, actionKey, nextAction, nameField } = cfV2Res;

    const name = config.name + (i == 1 ? '' : i);

    try {
        if (process.env.DEBUG) console.log(`${name}: obtained cookies and actionKey. starting join.js...`);

        const formData = new FormData();

        formData.append('1_$ACTION_REF_1', '');
        formData.append('1_$ACTION_1:0', JSON.stringify({ id: nextAction, bound: '$@1' }));
        formData.append('1_$ACTION_1:1', JSON.stringify([{ status: 'UNSET', message: '', fieldErrors: {} }]));
        formData.append('1_$ACTION_KEY', actionKey);
        formData.append('1_' + nameField, name);
        formData.append('1_joinCode', config.pin);
        formData.append('0', JSON.stringify([{ status: 'UNSET', message: '', fieldErrors: {} }, '$K1']));

        const playUrl = new URL('https://play.blooket.com/play?id=' + config.pin);
        const playClient = await createClient(playUrl.origin);

        const xActionRedirect = await new Promise((resolve) => {
            const headers = {
                ':method': 'POST',
                ':authority': playUrl.host,
                ':scheme': playUrl.protocol.replace(':', ''),
                ':path': playUrl.pathname,
                'sec-ch-ua-platform': '"macOS"',
                'next-action': nextAction,
                'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
                'sec-ch-ua-mobile': '?0',
                'baggage': 'sentry-environment=localdev,sentry-release=f6a56d953e3a8a5aa0951a9dbd381d63cfab4ded,sentry-public_key=b0d752c0f52533be04d27efb42ba6f17,sentry-trace_id=31e43404c54c4af8892210326ab64292,sentry-org_id=4508213881274368',
                'sentry-trace': '31e43404c54c4af8892210326ab64292-bcbe795c95d28e54',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
                'accept': 'text/x-component',
                'content-type': `multipart/form-data; boundary=${formData.getBoundary()}`,
                'origin': playUrl.origin,
                'sec-fetch-site': 'same-origin',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty',
                'referer': playUrl.href,
                'accept-encoding': 'deflate',
                'accept-language': 'en-US,en;q=0.9',
                'cookie': cookies,
                'priority': 'u=1, i'
            };

            const req = playClient.request(headers);

            req.setEncoding('utf8');

            req.on('data', (e) => {
                if (e.includes('blooket.com')) resolve(e.match(/message":"(.*?)"/)[1]);
            });

            req.on('end', () => playClient.close());

            formData.pipe(req);
        });

        if (process.env.DEBUG) console.log(`${name}: obtained x-action-redirect URL:`, xActionRedirect);

        let urlParts = xActionRedirect.split('/');
        let joinByIdUrl = new URL(`https://${urlParts[2]}/matchmake/joinById/${urlParts[3]}`);

        const joinCreds = await new Promise(async (resolve, reject) => {
            const joinByClient = await createClient(joinByIdUrl.origin);

            const headers = {
                ':method': 'POST',
                ':authority': joinByIdUrl.host,
                ':scheme': joinByIdUrl.protocol.replace(':', ''),
                ':path': joinByIdUrl.pathname,
                'content-length': '2',
                'sec-ch-ua-platform': '"macOS"',
                'authorization': `Bearer ${urlParts[5]}`,
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
                'accept': 'application/json',
                'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
                'content-type': 'application/json',
                'sec-ch-ua-mobile': '?0',
                'origin': joinByIdUrl.origin,
                'sec-fetch-site': 'same-origin',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty',
                'referer': xActionRedirect,
                'accept-encoding': 'deflate',
                'accept-language': 'en-US,en;q=0.9',
                'cookie': cookies,
                'priority': 'u=1, i'
            };

            const req = joinByClient.request(headers);

            let data = '';

            req.setEncoding('utf8');
            req.on('data', (d) => data += d);

            req.on('end', () => {
                joinByClient.close();
                try {
                    resolve(JSON.parse(data));
                } catch (err) {
                    reject(err);
                }
            });

            req.end('{}');
        });

        if (!joinCreds.sessionId) throw joinCreds;

        new WebSocket(`wss://${joinCreds.room.publicAddress}/${joinCreds.room.processId}/${joinCreds.room.roomId}?sessionId=${joinCreds.sessionId}`, {
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-US,en;q=0.9',
                'Origin': 'https://blooket.com',
                'Priority': 'u=0, i',
                'Sec-Ch-Ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"macOS"',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-site',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1',
                'Referer': 'https://blooket.com/play/',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
                cookie: cookies
            }
        })

        console.log(green(`${name}: joined!`));
        cb(2);
    } catch (err) {
        console.log(red(`${name}: failed to join :(`));
        if (process.env.DEBUG) console.error(err);
        cb(1);
    };
});