import enquirer from 'enquirer';

import cookieV2 from '../common/cookieV2.js';
import join from './join.js';

import { red } from '../common/color.js';

const config = await enquirer.prompt([
    { type: 'input', name: 'pin', message: 'Game Pin' },
    { type: 'input', name: 'name', message: 'Bot Name' },
    { type: 'input', name: 'amount', message: 'Bot Amount' }
]);

console.log('\n');

let success = 0;
let fail = 0;

const cfV2Res = await cookieV2('https://play.blooket.com/play?id=' + config.pin, 'beta');
if (process.env.DEBUG) console.log(`obtained cfV2Res.`, cfV2Res);

if (cfV2Res.incorrectType) {
    console.log(red('This game mode has not been rewritten and should NOT be botted using "bun beta".'));
    console.log(red('Please run "bun legacy" to use the legacy botting method instead.'));
    process.exit(0);
}

for (let i = 1; i <= config.amount; i++) {
    join(config, cfV2Res, i).then((result) => {
        if (result == 2) success++;
        else fail++;

        if (success + fail == config.amount) {
            console.log(`\n${success} bots joined!`);
            console.log(`${fail} bots failed to join.\n`);

            console.log('this program will stay alive forever to keep the bots online.');
            console.log('process control + c to remove the bots.');
            if (process.platform === 'darwin') console.log('hi fellow macos user! you need to use the literal control key, NOT the command key.');
        }
    });

    if (!process.env.PROXY) await new Promise((r) => setTimeout(r, 100));
}