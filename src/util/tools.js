import CryptoJS from "crypto-js/crypto-js";
import * as storeKeys from "@/store/storeKeys"
import {CONFI_GQUERY, ENABLE_API_CLONE} from "@/store/storeKeys"

export const sign = (timestamp, scret) => {
    var hash = CryptoJS.HmacSHA256(timestamp + "\n" + scret, scret);
    return encodeURIComponent(CryptoJS.enc.Base64.stringify(hash));
}

export function openUrl(href) {
    // 防止反复添加
    var id = 'startTelMedicine'
    var a = document.getElementById(id)
    if (!a) {
        a = document.createElement('a')
    }
    a.setAttribute('href', href)
    // a.setAttribute('target', '_blank')
    a.setAttribute('id', id)
    a.setAttribute('display', 'none')
    // a.onclick = function () {
    //关闭窗口的方法
    // window.opener = null
    // window.open('', '_self', '')
    // window.close()
    // }
    document.body.appendChild(a)
    a.click()
}

export const sendSmsLocal = function (tel, content) {
    let href = 'sms:' + tel + ';?&body=' + content
    openUrl(href);
}
export const callLocal = function (tel) {
    let href = 'tel:' + tel
    openUrl(href);
}

export const setIcon = function (imageData) {
    //自定义图标
    let link = document.querySelector("link[rel*='icon']") || document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = imageData;
    // link.href = require("@/assets/test.png");
    document.getElementsByTagName("head")[0].appendChild(link);
}


export function store(key, secret) {
    if (secret !== undefined) {
        localStorage.setItem(key, secret)
        return secret;
    }
    var item = localStorage.getItem(key);
    return item ? item : '';
}

export const historyServer = obj => {
    if (obj !== undefined) {
        let serverArr = historyServer();
        serverArr.push(obj)
        store(storeKeys.HISTORY_SERVER, JSON.stringify(serverArr))
        return obj;
    }
    var item = store(storeKeys.HISTORY_SERVER);
    return item ? JSON.parse(item) : [];
}
export const enableCloneConfig = () => {
    var item = store(CONFI_GQUERY);
    return item ? JSON.parse(item)[ENABLE_API_CLONE] : false;
}

export const secret = secret => {
    // if (obj !== undefined) {
    //     var serverArr = historyServer();
    //
    // }
    return store(storeKeys.SECRET, secret)
};

export const serverUrl = secret => store(storeKeys.SERVER_URL, secret);
