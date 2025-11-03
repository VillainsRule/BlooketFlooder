import chalk from 'chalk';
import enquirer from 'enquirer';

import join from './join.js';

import init from '../common/init.js';

console.log(chalk.hex('#ffff00')('\nblooketflooder beta has started!\n'));

await init();

const config = await enquirer.prompt([
    { type: 'input', name: 'pin', message: 'Game Pin' },
    { type: 'input', name: 'name', message: 'Bot Name' },
    { type: 'input', name: 'amount', message: 'Bot Amount' }
]);

console.log('\n');

let success = 0;
let fail = 0;

for (let i = 1; i <= config.amount; i++) {
    const result = await join(config, i);

    if (result == 2) success++;
    else fail++;

    if (success + fail == config.amount) {
        console.log(`\n${success} bots joined!`);
        console.log(`${fail} bots failed to join.\n`);

        console.log('this program will stay alive forever to keep the bots online.');
        console.log('process control (win) or command (mac) + c to remove the bots.');
    }

    await new Promise(r => setTimeout(r, 677));
}