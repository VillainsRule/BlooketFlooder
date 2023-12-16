import readline from 'readline';
import chalk from 'chalk';
import axios from 'axios';

import bsid from './bsid.js';
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

let start = async () => {
    let gamePin = await question(write('Game Pin > '));
    console.log(write('\n{t}Creating session ID...'));

    let gameExists = await axios.post('https://play.blooket.com/api/playersessions/hosted', {
        gameCode: gamePin
    }, {
        headers: {
            'cookie': await bsid()
        }
    }).catch(err => {
        console.log(chalk.hex('#f00')(`\t\tError: Game pin not found.`));
        process.emit(0);
    });

    let url = gameExists.data.n;
    let mode = url.includes('cryptohack') ? 'Crypto Hack' :
    url.includes('santasworkshop') ? 'Santa\'s Workshop' : 
    url.includes('pirate') ? 'Pirate\'s Voyage' :
    url.includes('goldquest') ? 'Gold Quest' :
    url.includes('fishingfrenzy') ? 'Fishing Frenzy' :
    url.includes('towerdefense2') ? 'Tower Defense 2' :
    url.includes('monsterbrawl') ? 'Monster Brawl' :
    url.includes('deceptivedinos') ? 'Deceptive Dinos' :
    url.includes('battleroyale') ? 'Battle Royale' :
    url.includes('towerdefense') ? 'Tower Defense' :
    url.includes('cafe') ? 'Cafe' :
    url.includes('factory') ? 'Factory' :
    url.includes('racing') ? 'Racing' :
    url.includes('blookrush') ? 'Blook Rush' : 'Classic';

    console.log(write(`Session created! Mode: ${mode}`));

    let name = await question(write('\n{t}Bot Name > '));
    let amount = await question(write('Bot Amount > '));

    for (let i = 1; i <= amount; i++) await join(gamePin, name + i);
};

start();