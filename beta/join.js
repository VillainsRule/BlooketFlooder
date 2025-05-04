import fs from 'node:fs';
import path from 'node:path';

import axios from 'axios';
import { WebSocket } from 'ws';

import { headers } from '../common/init.js';

const cookieFile = path.join(import.meta.dirname, '..', 'common', '.cookie');

export default async (config, i, cb) => {
    let name = config.name + (i == 1 ? '' : i);

    try {
        const cookies = fs.readFileSync(cookieFile, 'utf-8');

        const formData = new FormData();

        formData.append('1_nickname', name);
        formData.append('0', JSON.stringify([config.pin, { message: '' }, '$K1']));

        let redirect = await axios.post(`https://play.blooket.com/play?id=${config.pin}`, formData, {
            headers: {
                'next-action': '5140d9c38b14cac886fa554034a9c5fd90dae622',
                cookie: cookies
            },
            validateStatus: (status) => status == 303 || status == 200
        });

        let url = redirect.headers.get('x-action-redirect');

        if (!url) {
            console.log('\n[DEBUG] x-action-redirect=' + url);
            console.log('[DEBUG] data=' + JSON.stringify(redirect.data) + '\n');
        }

        let urlParts = url.split('/');

        let joinResult = await axios.post(`https://${urlParts[2]}/matchmake/joinById/${urlParts[3]}`, {}, {
            headers: {
                ...headers,
                Authorization: `Bearer ${urlParts[5]}`,
                Cookie: cookies,
                Referer: url
            }
        });

        let creds = joinResult.data;
        if (!creds.sessionId) throw joinResult;

        new WebSocket(`wss://${creds.room.publicAddress}/${creds.room.processId}/${creds.room.roomId}?sessionId=${creds.sessionId}`, {
            headers: {
                ...headers,
                cookie: cookies
            }
        })

        console.log(`${name}: joined!`);
        cb(2);
    } catch (err) {
        console.log(`${name}: failed to join :(`);
        cb(1);
    };
};