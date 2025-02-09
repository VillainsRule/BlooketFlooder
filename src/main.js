import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

import axios from 'axios';
import chalk from 'chalk';

import grabCookies from './cookie.js';
import join from './join.js';

axios.defaults.headers.common['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7';
axios.defaults.headers.common['Accept-Language'] = 'en-US,en;q=0.9';
axios.defaults.headers.common['Priority'] = 'u=0, i';
axios.defaults.headers.common['Sec-Ch-Ua'] = '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"';
axios.defaults.headers.common['Sec-Ch-Ua-Mobile'] = '?0';
axios.defaults.headers.common['Sec-Ch-Ua-Platform'] = '"macOS"';
axios.defaults.headers.common['Sec-Fetch-Dest'] = 'document';
axios.defaults.headers.common['Sec-Fetch-Mode'] = 'navigate';
axios.defaults.headers.common['Sec-Fetch-Site'] = 'same-site';
axios.defaults.headers.common['Sec-Fetch-User'] = '?1';
axios.defaults.headers.common['Upgrade-Insecure-Requests'] = '1';
axios.defaults.headers.common['Referer'] = 'https://www.blooket.com/';
axios.defaults.headers.common['Referrer-Policy'] = 'strict-origin-when-cross-origin';
axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome';

const cookieFile = path.join(import.meta.dirname, '.cookie');
while (!fs.existsSync(cookieFile)) {
    console.log('Bypassing Cloudflare AntiBot...');
    await grabCookies();
}

const cookies = fs.readFileSync(cookieFile, 'utf-8');
axios.defaults.headers.common['cookie'] = cookies;

let rl = readline.createInterface(process.stdin, process.stdout);

let question = async (q) => new Promise(resolve => rl.question(q, resolve));
let hex = chalk.hex('#149414');
let write = (m) => m.includes('{t}') ? hex(m.replace('{t}', '\t\t')) : hex(`\t\t${m}`);

console.clear();
console.log(hex(`\n\n\t ▄▄▄▄    ██▓     ▒█████   ▒█████   ██ ▄█▀▓█████▄▄▄█████▓        █████▒██▓     ▒█████   ▒█████  ▓█████▄ 
\t▓█████▄ ▓██▒    ▒██▒  ██▒▒██▒  ██▒ ██▄█▒ ▓█   ▀▓  ██▒ ▓▒      ▓██   ▒▓██▒    ▒██▒  ██▒▒██▒  ██▒▒██▀ ██▌
\t▒██▒ ▄██▒██░    ▒██░  ██▒▒██░  ██▒▓███▄░ ▒███  ▒ ▓██░ ▒░      ▒████ ░▒██░    ▒██░  ██▒▒██░  ██▒░██   █▌
\t▒██░█▀  ▒██░    ▒██   ██░▒██   ██░▓██ █▄ ▒▓█  ▄░ ▓██▓ ░       ░▓█▒  ░▒██░    ▒██   ██░▒██   ██░░▓█▄   ▌
\t░▓█  ▀█▓░██████▒░ ████▓▒░░ ████▓▒░▒██▒ █▄░▒████▒ ▒██▒ ░       ░▒█░   ░██████▒░ ████▓▒░░ ████▓▒░░▒████▓ 
\t░▒▓███▀▒░ ▒░▓  ░░ ▒░▒░▒░ ░ ▒░▒░▒░ ▒ ▒▒ ▓▒░░ ▒░ ░ ▒ ░░          ▒ ░   ░ ▒░▓  ░░ ▒░▒░▒░ ░ ▒░▒░▒░  ▒▒▓  ▒ 
\t▒░▒   ░ ░ ░ ▒  ░  ░ ▒ ▒░   ░ ▒ ▒░ ░ ░▒ ▒░ ░ ░  ░   ░           ░     ░ ░ ▒  ░  ░ ▒ ▒░   ░ ▒ ▒░  ░ ▒  ▒ 
\t ░    ░   ░ ░   ░ ░ ░ ▒  ░ ░ ░ ▒  ░ ░░ ░    ░    ░             ░ ░     ░ ░   ░ ░ ░ ▒  ░ ░ ░ ▒   ░ ░  ░ 
\t ░          ░  ░    ░ ░      ░ ░  ░  ░      ░  ░                         ░  ░    ░ ░      ░ ░     ░    
\t      ░                                                                                         ░      \n\n`));

const modes = {
    cryptohack: 'Crypto Hack',
    santasworkshop: 'Santa\'s Workshop',
    pirate: 'Pirate\'s Voyage',
    goldquest: 'Gold Quest',
    fishingfrenzy: 'Fishing Frenzy',
    towerdefense2: 'Tower Defense 2',
    monsterbrawl: 'Monster Brawl',
    deceptivedinos: 'Deceptive Dinos',
    battleroyale: 'Battle Royale',
    towerdefense: 'Tower Defense',
    cafe: 'Cafe',
    factory: 'Factory',
    racing: 'Racing',
    blookrush: 'Blook Rush'
};

let gamePin = await question(write('Game Pin > '));
console.log(write('\n{t}Fetching information...'));

let gameExists = await axios.post('https://play.blooket.com/api/playersessions/hosted', {
    gameCode: gamePin
}).catch((e) => {
    console.log(e);
    console.log(chalk.hex('#f00')(`\t\tError: Game pin not found.`));
    process.exit(0);
});

let url = gameExists.data.n;
let mode = 'Classic';

for (const [key, value] of Object.entries(modes)) {
    if (url.includes(key)) {
        mode = value;
        break;
    }
};

console.log(write(`Game found! Mode: ${mode}`));

let name = await question(write('\n{t}Bot Name > '));
let amount = await question(write('Bot Amount > '));

console.log('\n');

let success = 0;
let fail = 0;

for (let i = 1; i <= amount; i++) await join(gamePin, name + i, (result) => {
    if (result == 2) success++;
    else fail++;

    if (success + fail == amount) {
        console.log(write(`\n{t}${success}/${fail} bots joined!\n`));
        process.exit(0);
    }
});