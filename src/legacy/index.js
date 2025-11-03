import readline from 'node:readline';

import axios from 'axios';
import chalk from 'chalk';

import join from './join.js';

import init from '../common/init.js';

await init();

console.log(chalk.hex('#ffff00')('\nblooketflooder legacy has started!\n'));

let rl = readline.createInterface(process.stdin, process.stdout);

let question = async (q) => new Promise(resolve => rl.question(q, resolve));
let write = (m) => chalk.hex('#149414')(m);

const modes = {
    cryptohack: 'Crypto Hack',
    santasworkshop: 'Santa\'s Workshop',
    goldquest: 'Gold Quest',
    fishingfrenzy: 'Fishing Frenzy'
};

let gamePin = await question(write('Game Pin > '));
console.log(write('\nFetching information...'));

let gameExists = await axios.post('https://play.blooket.com/api/playersessions/hosted', {
    gameCode: gamePin
}).catch((e) => {
    console.log(e);
    console.log(chalk.hex('#f00')(`Error: Game pin not found.`));
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

let name = await question(write('\nBot Name > '));
let amount = await question(write('Bot Amount > '));

console.log('\n');

let success = 0;
let fail = 0;

for (let i = 1; i <= amount; i++) await join(gamePin, name + i, (result) => {
    if (result == 2) success++;
    else fail++;

    if (success + fail == amount) {
        console.log(write(`\n${success}/${fail} bots joined!\n`));
        process.exit(0);
    }
});s