import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import chalk from 'chalk';

import select from './blooks.js';
import bsid from './bsid.js';

export default async (id, name) => {
    try {
        let joinResult = await axios.put('https://fb.blooket.com/c/firebase/join', {
            id,
            name
        }, {
            headers: {
                cookie: await bsid()
            }
        });

        if (!joinResult.data.success) return {
            success: false,
            error: joinResult.data
        };

        let selectedBlook = select();

        let liveApp = initializeApp({
            apiKey: 'AIzaSyCA-cTOnX19f6LFnDVVsHXya3k6ByP_MnU',
            authDomain: 'blooket-20 20.firebaseapp.com',
            projectId: 'blooket-2020',
            storageBucket: 'blooket-2020.appspot.com',
            messagingSenderId: '741533559105',
            appId: '1:741533559105:web:b8cbb10e6123f2913519c0',
            measurementId: 'G-S3H5NGN10Z',
            databaseURL: joinResult.data.fbShardURL
        });

        const app = getAuth(liveApp);
        await signInWithCustomToken(app, joinResult.data.fbToken).catch(console.error);

        const db = getDatabase();
        await set(ref(db, `${id}/c/${name}`), { b: selectedBlook });

        console.log(chalk.hex('#149414')(`\t\t${name}: joined with blook ${selectedBlook}!`));
    } catch (err) {
        console.log(chalk.hex('#149414')(`\t\t${name}: failed to join :(`));
    };
};