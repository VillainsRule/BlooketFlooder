import fs from 'node:fs';
import path from 'node:path';

import axios from 'axios';
import WebSocket from 'ws';

import { headers } from '../common/init.js';

const cookieFile = path.join(import.meta.dirname, '..', 'common', '.cookie');

export default async (config, i) => new Promise(async (r) => {
    let name = config.name + (i == 1 ? '' : i);

    try {
        const cookies = fs.readFileSync(cookieFile, 'utf-8');

        const actionKeyReq = await axios.get(`https://play.blooket.com/play?id=${config.pin}`, {
            headers: {
                ...headers,
                cookie: cookies
            }
        });

        const nextAction = actionKeyReq.data.match(/<input type="hidden" name="\$ACTION_1:0" value="\{&quot;id&quot;:&quot;(.*?)&quot;,&quot;bound&quot;:&quot;\$@1&quot;\}"/)?.[1];
        const nameField = actionKeyReq.data.match(/maxLength="15" autofocus="" name="(.*?)"/)?.[1];

        const formData = new FormData();

        formData.append('1_' + nameField, name);
        formData.append('1_joinCode', config.pin);
        formData.append('0', JSON.stringify([{ status: 'UNSET', message: '', fieldErrors: {} }, '$K1']));

        let redirect = await axios.post(`https://play.blooket.com/play?id=${config.pin}`, formData, {
            headers: {
                'next-action': nextAction,
                cookie: cookies
            },
            validateStatus: (status) => status == 303 || status == 200
        });

        const result = redirect.data.match(/message":"(.*?)"/)?.[1];
        if (!result.includes('blooket.com')) throw new Error('got error:' + result);

        let urlParts = result.split('/');

        let joinResult = await axios.post(`https://${urlParts[2]}/matchmake/joinById/${urlParts[3]}`, {}, {
            headers: {
                ...headers,
                Authorization: `Bearer ${urlParts[5]}`,
                Cookie: cookies,
                Referer: result
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
        r(2);
    } catch (err) {
        console.log(`${name}: failed to join :(`, err);
        r(1);
    };
});