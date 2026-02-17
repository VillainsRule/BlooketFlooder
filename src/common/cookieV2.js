import createClient from './createClient.js';

const cookieV2 = (inputUrl, type) => new Promise(async (resolve) => {
    const isBeta = type === 'beta';

    const url = new URL(inputUrl);
    const client = await createClient(url.origin);

    const headers = {
        ':method': 'GET',
        ':authority': url.host,
        ':scheme': url.protocol.replace(':', ''),
        ':path': url.pathname + url.search,
        'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'sec-fetch-site': 'none',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-user': '?1',
        'sec-fetch-dest': 'document',
        'accept-encoding': 'deflate',
        'accept-language': 'en-US,en;q=0.9',
        'priority': 'u=0, i'
    };

    const req = client.request(headers);

    // we going to the mental hospital with this one 💯 🙏 😭

    let cookies = '';
    let actionKey = '';
    let nextAction = '';
    let nameField = '';
    let redirectUrl = '';
    let allData = '';

    req.on('response', (headers) => {
        if (headers['set-cookie']) {
            if (process.env.DEBUG) console.log('cookieV2 response headers received', headers['set-cookie']);
            cookies = headers['set-cookie'].map((cookie) => cookie.split(';')[0]).join('; ');
            if (cookies && process.env.DEBUG) console.log('[debug] cookiev2', cookies);
            if (cookies && ((isBeta && actionKey && nextAction && nameField) || (!isBeta && (redirectUrl || type === 'legacy2' || (type === 'legacy1' && allData.includes('Join a Game')))))) resolve({ cookies, actionKey, nextAction, nameField });
        } else throw new Error('so it probably broke open a github issue =D');
    });

    req.setEncoding('utf8');
    req.on('data', (d) => {
        if (isBeta) {
            if (d.includes('play/landing?t=')) resolve({ incorrectType: true });

            actionKey = d.match(/<input type="hidden" name="\$ACTION_KEY" value="(.*?)"/)?.[1];
            nextAction = d.match(/<input type="hidden" name="\$ACTION_1:0" value="\{&quot;id&quot;:&quot;(.*?)&quot;,&quot;bound&quot;:&quot;\$@1&quot;\}"/)?.[1];
            nameField = d.match(/maxLength="15" [A-z\s"=]+ name="(.*?)"/)?.[1];

            if ((actionKey || nextAction || nameField) && process.env.DEBUG) console.log('[debug] cookiev2', { actionKey, nextAction, nameField });

            if (cookies && actionKey && nextAction && nameField) resolve({ cookies, actionKey, nextAction, nameField });
        } else {
            redirectUrl = d.match(/NEXT_REDIRECT;replace;(.*?);/)?.[1];
            if (cookies && (redirectUrl || type === 'legacy2')) resolve({ cookies, redirectUrl });
        }
    });

    req.on('end', () => {
        client.close();
    });
    req.end();
});

export default cookieV2;