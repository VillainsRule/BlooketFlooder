import axios from 'axios';

let bsid = '';

export default async () => {
    if (bsid === '') {
        let request = await axios.get('https://play.blooket.com/');;
        bsid = request.headers['set-cookie'][0].split(';')[0];
    };

    return bsid;
};