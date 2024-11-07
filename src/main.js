import readline from 'readline';
import chalk from 'chalk';
import axios from 'axios';

import join from './join.js';

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
console.log(write('\n{t}Creating session ID...'));

let request = await axios.get('https://goldquest.blooket.com/');
let bsid = request.headers['set-cookie'][0].split(';')[0];

axios.defaults.headers.common['cookie'] = bsid;

let gameExists = await axios.post('https://play.blooket.com/api/playersessions/hosted', {
    gameCode: gamePin
}).catch(() => {
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

console.log(write(`Session created! Mode: ${mode}`));

let name = await question(write('\n{t}Bot Name > '));
let amount = await question(write('Bot Amount > '));

let success = 0;
let fail = 0;

for (let i = 1; i <= amount; i++) {
    let result = await join(gamePin, name + i);

    if (result == 2) success++;
    else fail++;
};

write(`\n{t}joined ${success} bots successfully, but ${fail} failed.`);