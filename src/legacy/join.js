import createClient from '../common/createClient.js';
import cookieV2 from '../common/cookieV2.js';

import BLOOK_LIST from './blooks.js';

import { green, red } from '../common/color.js';

export default async (redirectUrl, id, name, cb) => {
    try {
        const { cookies } = await cookieV2(redirectUrl, 'legacy2');

        const joinUrl = new URL('https://fb.blooket.com/c/firebase/join');
        const joinClient = await createClient(joinUrl.origin);

        const joinResult = await new Promise((resolve) => {
            const json = JSON.stringify({ id, name });

            const req = joinClient.request({
                ':method': 'PUT',
                ':authority': joinUrl.host,
                ':scheme': joinUrl.protocol.replace(':', ''),
                ':path': joinUrl.pathname,
                'content-length': Buffer.byteLength(json),
                'sec-ch-ua-platform': '"macOS"',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
                'accept': 'application/json, text/plain, */*',
                'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
                'content-type': 'application/json',
                'sec-ch-ua-mobile': '?0',
                'origin': 'https://goldquest.blooket.com',
                'sec-fetch-site': 'same-site',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty',
                'referer': 'https://goldquest.blooket.com/',
                'accept-encoding': 'deflate',
                'accept-language': 'en-US,en;q=0.9',
                'cookie': cookies,
                'priority': 'u=1, i'
            });

            let data = '';

            req.on('data', (e) => data += e);

            req.on('end', () => {
                joinClient.close();

                try {
                    const json = JSON.parse(data);
                    resolve(json);
                } catch {
                    if (data.includes('Just a moment')) console.error('cloudflare is blocking us...dangit. open an issue on github.');
                    else console.error('if this happens on all bots, open an issue on github with the code "invalid json"', data);

                    resolve({});
                }
            });

            req.end(json);
        });

        if (!joinResult.fbToken || !joinResult.fbShardURL) {
            console.log(red(`${name} faled to join w/ reason ${joinResult.msg || 'unknown'}`));
            return cb(1);
        }

        const signInReq = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyCA-cTOnX19f6LFnDVVsHXya3k6ByP_MnU', {
            method: 'POST',
            body: JSON.stringify({ token: joinResult.fbToken, returnSecureToken: true }),
            headers: { 'Content-Type': 'application/json' },
            proxy: process.env.PROXY
        });

        const signInRes = await signInReq.json();

        const selectedBlook = BLOOK_LIST[BLOOK_LIST.length * Math.random() | 0];

        const shardWs = joinResult.fbShardURL.replace('https', 'wss') + '.ws?v=5&p=1:741533559105:web:b8cbb10e6123f2913519c0'; // fb "appId"
        const testWs = new WebSocket(shardWs);

        testWs.onerror = (err) => {
            console.error(red(`${name} failed to join (websocket error)`), err);
            cb(1);
        }

        let wasProperClose = false;

        testWs.onmessage = (msg) => {
            let json;
            try {
                json = JSON.parse(msg.data);
                if (process.env.DEBUG) console.log('received message:', json);
            } catch { return }

            if (json.d?.d?.h?.includes?.('firebaseio.com')) {
                if (process.env.DEBUG) console.log('[1] sending fbtoken');
                testWs.send(JSON.stringify({ t: 'd', d: { r: 1, a: 's', b: { c: { 'sdk.js.10-14-1': 1 } } } }));
                testWs.send(JSON.stringify({ t: 'd', d: { r: 2, a: 'auth', b: { cred: signInRes.idToken } } }));
                testWs.send(JSON.stringify({ t: 'd', d: { r: 3, a: 'q', b: { p: `/${id}`, h: '' } } }));
            }

            if (json.d?.b?.d?.stg === 'join') {
                if (process.env.DEBUG) console.log('[2] setting blook');
                testWs.send(JSON.stringify({ t: 'd', d: { r: 4, a: 'n', b: { p: `/${id}` } } }));
                testWs.send(JSON.stringify({ t: 'd', d: { r: 5, a: 'p', b: { p: `/${id}/c/${name}`, d: { b: selectedBlook } } } }));
            }

            if (json.d?.r === 5) {
                wasProperClose = true;
                testWs.close();
                console.log(green(`${name} joined the game with blook ${selectedBlook}!`));
                cb(2);
            }
        }

        testWs.onclose = (e) => {
            if (!wasProperClose) {
                console.error(red(`${name} faled to join (improper close)`), e);
                cb(1);
            }
        }
    } catch (err) {
        console.log(red(`${name} faled to join (caught error)`), err);
        cb(1);
    };
};