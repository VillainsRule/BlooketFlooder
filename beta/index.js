console.log('Similar to Blooket, this botting is Beta.');
console.log('If you encounter any issues, please report them to the GitHub repository.');
console.log('You may see an unusual amount of debug logs, this is normal given the circumstances.');
console.log('If something goes wrong, please copy these full logs onto Github issues.\n');

import enquirer from 'enquirer';

import join from './join.js';

import init from '../common/init.js';

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
    join(config, i, (result) => {
        if (result == 2) success++;
        else fail++;

        if (success + fail == config.amount) {
            console.log(`\n${success} bots joined!`);
            console.log(`${fail} bots failed to join.\n`);

            console.log('this program will stay alive forever to keep the bots online.');
            console.log('process control (win) or command (mac) + c to remove the bots.');
        }
    });

    await new Promise((r) => setTimeout(r, 200));
}