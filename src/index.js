import enquirer from 'enquirer';

import { bold, orange, purple, red, yellow } from './common/color.js';

console.log(bold(yellow('BlooketFlooder Pro')));

if (typeof Bun === 'undefined') {
    console.error(red('❌ this script requires bun (https://bun.sh) to bypass cloudflare antibot'));
    process.exit(1);
}

console.log(purple('✨ this is the formerly private version with:'));
console.log(purple('  - 100% cloudflare bypass (no popup windows)'));
console.log(purple('  - instant join'));
console.log(purple('  - 60-70% less resources used\n'));

if (!process.env.PROXY) console.log(orange('⚠️  use a proxy for faster botting! see the README for more info\n'));

const isOctober = new Date().getMonth() === 9;
const isDecember = new Date().getMonth() === 11;
const unrewritten = [isOctober ? 'Candy Quest' : 'Gold Quest', 'Crypto Hack', 'Fishing Frenzy'];
if (isDecember) unrewritten.push('Santa\'s Workshop');

const isUsingLegacy = await enquirer.prompt({
    type: 'select',
    name: 'is',
    message: `Is your gamemode one of ${unrewritten.join(', ')}?`,
    choices: ['yes', 'no']
});

if (isUsingLegacy.is.startsWith('y')) import('./legacy/index.js');
else if (isUsingLegacy.is.startsWith('n')) import('./beta/index.js');
else console.log('idrk what you just put so the program has quit run it again and type yes or no next time');