import chalk from 'chalk';
import enquirer from 'enquirer';

console.log(chalk.hex('#ffff00')('blooketflooder basic edition'));
console.log(chalk.hex('#bf00ff')('✨ contact @thkxz on discrd for blooketflooder pro (is free)!'));
console.log(chalk.hex('#bf00ff')('  - 100% cloudflare bypass (no popup windows)'));
console.log(chalk.hex('#bf00ff')('  - instant join'));
console.log(chalk.hex('#bf00ff')('  - 60-70% less resources used\n'));

const isOctober = new Date().getMonth() === 9;
const unrewritten = [isOctober ? 'Candy Quest' : 'Gold Quest', 'Crypto Hack', 'Fishing Frenzy'];

console.log('Blooket is updating their gamemodes to a new engine named Colyseus.');
console.log('The following gamemodes have NOT been rewritten yet and will use the legacy botting method:');
for (const mode of unrewritten) console.log('- ' + mode);

console.log('');

const isUsingLegacy = await enquirer.prompt({
    type: 'select',
    name: 'is',
    message: 'my gamemode is one of the UNREWRITTEN modes listed above',
    choices: ['yes', 'no']
});

if (isUsingLegacy.is.startsWith('y')) import('./legacy/index.js');
else if (isUsingLegacy.is.startsWith('n')) import('./beta/index.js');
else console.log('idrk what you just put so the program has quit run it again and type yes or no next time');