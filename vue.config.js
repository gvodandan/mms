module.exports = {
    devServer: {
        port: 8888,
        // host: 'localhost',
        https: false,
        open: true,
        proxy: {     //开发环境代理
            [process.env.VUE_APP_BASE_API]: {   //'/dev-api'
                target: process.env.VUE_APP_SERVICE_URI,    //目标服务器的地址，代理访问http://localhost:8001/
                changeOrigin: true,       //开启代理服务器，会进行代理转发
                pathRewrite: {
                    //  /dev-api/db.json 最终会发送到http://localhost:8001/db.json
                    //将请求地址的前缀/dev-api替换为空的''
                    // '^/dev-api': '',
                    ['^'+process.env.VUE_APP_BASE_API]:''
                }
            }

        }
    },
    lintOnSave: false,
    productionSourceMap: false,
}