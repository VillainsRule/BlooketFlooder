import fs from 'node:fs';
import path from 'node:path';

if (typeof self === 'undefined') global.self = {};

self.webpackChunk_N_E = {
    push: (e) => {
        const chunks = e[1];
        const chunk = Object.values(chunks)[0];

        const exports = {};
        const module = { exports };
        const require = {
            d: (target, all) => Object.keys(all).forEach((key) => Object.defineProperty(target, key, {
                enumerable: true,
                get: all[key]
            }))
        };

        chunk(module, exports, require);

        const all = Object.values(exports);

        all.forEach((e) => {
            if (Array.isArray(e)) return;

            const allBlooks = Object.keys(e);

            fs.writeFileSync(
                path.join(import.meta.dirname, '..', 'blooks.js'),
                `const BLOOK_LIST = [\n    '${allBlooks.join('\',\n    \'')}'\n];\n\nexport default BLOOK_LIST;`
            );

            console.log(`scraped ${allBlooks.length} blooks!`);
        })
    }
}

const jsFile = fs.readFileSync(path.join(import.meta.dirname, 'file.js'), 'utf-8');
eval(jsFile);