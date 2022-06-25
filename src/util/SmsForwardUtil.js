import CryptoJS from "crypto-js/crypto-js";

const sisgn = (timestamp, scret) => {
    var hash = CryptoJS.HmacSHA256(timestamp + "\n" + scret, scret);
    return encodeURIComponent(CryptoJS.enc.Base64.stringify(hash));
}

function store(key, secret) {
    if (secret) {
        localStorage.setItem(key, secret)
        return secret;
    }
    var item = localStorage.getItem(key);
    return item ? item : '';
}

const secret = secret => store('secret', secret);

const serverUrl = secret => store('serverUrl', secret);

export default {
    sisgn, secret, serverUrl, store
}
