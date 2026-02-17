import enquirer from 'enquirer';

import cookieV2 from '../common/cookieV2.js';
import join from './join.js';

import { green, orange, red, yellow } from '../common/color.js';

const modes = {
    cryptohack: 'Crypto Hack',
    santasworkshop: 'Santa\'s Workshop',
    goldquest: 'Gold Quest',
    fishingfrenzy: 'Fishing Frenzy'
};

/*
console.log(red('STOP AND READ THE BELOW CAREFULLY!'));
console.log(orange('If the gamemode you are botting is NOT one of:'));
console.log(orange(Object.values(modes).join(', ')));
console.log(orange('it is NOT supported by the legacy botting method.'));
console.log(orange('Run CTRL + C to exit and then run "bun beta" to use the Beta botting method instead.\n'));

const legacyConfirm = await enquirer.prompt({
    type: 'confirm',
    name: 'isLegacyMode',
    message: 'Is your gamemode one of Crypto Hack, Santa\'s Workshop, Gold Quest, or Fishing Frenzy?',
    initial: true
});

if (!legacyConfirm.isLegacyMode) {
    console.log(red('\nExiting... Please run "bun beta" to use the Beta botting method instead.\n'));
    process.exit(0);
}
*/

const config = await enquirer.prompt([
    { type: 'input', name: 'pin', message: 'Game Pin' },
    { type: 'input', name: 'name', message: 'Bot Name' },
    { type: 'input', name: 'amount', message: 'Bot Amount' }
]);

console.log(yellow('\nverifying game pin...'));

const { redirectUrl } = await cookieV2('https://play.blooket.com/play?id=' + config.pin, 'legacy1');
if (!redirectUrl) console.log(red('Failed to verify game pin. Open an issue on Github if you believe this is an error.'));

let mode = 'Unknown (this means stuff broke, open an issue on Github)';

for (const [key, value] of Object.entries(modes)) {
    if (redirectUrl.includes(key)) {
        mode = value;
        break;
    }
}

console.log(green('verified game pin! mode: ' + mode + '\n'));

let success = 0;
let fail = 0;

for (let i = 1; i <= config.amount; i++) {
    join(redirectUrl, config.pin, config.name + i, (result) => {
        if (result == 2) success++;
        else fail++;

        if (success + fail == config.amount) console.log(green(`${success}/${config.amount} bots joined successfully!`));
    });

    if (!process.env.PROXY) await new Promise((r) => setTimeout(r, 300));
}