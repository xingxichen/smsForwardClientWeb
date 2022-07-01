export function downLoad(data, filename) {
    data = typeof data === "string" ? data : JSON.stringify(data)
    // res 调用接口后返回的数据
    // filename自定义文件名
    let blob = new Blob([data]); // 将返回的数据通过Blob的构造方法，创建Blob对象
    if ('msSaveOrOpenBlob' in navigator) {
        window.navigator.msSaveOrOpenBlob(blob, filename); // 针对浏览器
    } else {
        const elink = document.createElement('a'); // 创建a标签
        elink.download = filename;
        elink.style.display = 'none';
        // 创建一个指向blob的url，这里就是点击可以下载文件的根结
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); //移除链接
        document.body.removeChild(elink); //移除a标签
    }
}

export function uploadFile(event, onload) {
    console.log(event)
    //此处校验文件后缀
    const selectedFile = event.target.files[0]
    // (利用console.log输出看file文件对象)json
    let num = selectedFile.name.split('.');
    let mun = num[num.length - 1];
    console.log('文件后缀:', mun)
    console.log('文件:', selectedFile)
    // FileReader对象，h5提供的异步api，可以读取文件中的数据。
    const reader = new FileReader()
    //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可,此处this指向reader，_that指向vue data，this.result就是文件的内容
    reader.onload = () => onload(reader.result)
    // readAsText是个异步操作，只有等到onload时才能显示数据。
    reader.readAsText(selectedFile)
}
