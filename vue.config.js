const {defineConfig} = require('@vue/cli-service')


// let versFunc = () => {
//     const d = new Date();
//     const yy = d.getFullYear().toString().slice(2);
//     const MM = d.getMonth() + 1 >= 10 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1);
//     const DD = d.getDate() >= 10 ? d.getDate() : "0" + d.getDate();
//     const h = d.getHours() >= 10 ? d.getHours() : "0" + d.getHours();
//     const mm = d.getMinutes() >= 10 ? d.getMinutes() : "0" + d.getMinutes();
//     return yy + MM + DD + h + mm;
// };

// let version = versFunc();
module.exports = defineConfig({
    transpileDependencies: true, lintOnSave: false, publicPath: "./",//url前缀
    // publicPath: process.env.NODE_ENV === "production" ? "/smsForwardClientWeb/" : "/",//url前缀
    outputDir: `./docs`, //生成打包文件的目录 （会清除上一次的文件）
    // assetsDir: `./${version}`, //打包编译后的静态资源所在的目录位置
    indexPath: "index.html", //生成的index.html 文件所在的位置
    filenameHashing: true, //静态文件文件名哈希
    devServer: {
        host: '0.0.0.0', hot: true, port: 8080, allowedHosts: 'all', //跨域代理设置
        proxy: {
            '/api': {
                target: 'http://xxx.fun', changeOrigin: true, ws: true, pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }, // pwa: {
    //     iconPaths: {
    //         favicon32: 'favicon.ico',
    //         favicon16: 'favicon.ico',
    //         appleTouchIcon: 'favicon.ico',
    //         maskIcon: 'favicon.ico',
    //         msTileImage: 'favicon.ico'
    //     }
    // }
    pluginOptions: {
        electronBuilder: {
            // preload: './preload.js',
            builderOptions: {
                "productName": "smsFW",
                "appId": "xingxichen.el_smsFW",
                "copyright": "xingxichen©smsFW",
                // "directories": {
                //     "output": "app_file"
                // },
                "nsis": {
                    "oneClick": false,
                    "allowElevation": true,
                    "allowToChangeInstallationDirectory": true,
                    "installerIcon": "./public/favicon256x256.ico",
                    "uninstallerIcon": "./public/favicon256x256.ico",
                    "installerHeaderIcon": "./public/favicon256x256.ico",
                    "createDesktopShortcut": true,
                    "createStartMenuShortcut": true,
                    "shortcutName": "短信转发器"
                },
                "win": {
                    "icon": "./public/favicon256x256.ico", "target": [{
                        "target": "nsis", "arch": ["ia32"]
                    }]
                }

            },
        }
    },
})
