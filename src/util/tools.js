import CryptoJS from "crypto-js/crypto-js";

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

export function getOrDefault(store, key, def) {
    const storeElement = store[key];
    return storeElement != null ? storeElement : def;
}

export function unique(arr, func) {
    const res = new Map();
    return arr.filter(it => {
        let key = func(it);
        return key && !res.has(key) && res.set(key, true);
    });
}
