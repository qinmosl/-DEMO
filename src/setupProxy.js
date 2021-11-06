const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        createProxyMiddleware("/server",{  //   这个/api，就是识别的请求路径拼接，告诉请求，当什么请求时，需要用到这里跨域
            target: "https://www.standpoint.top",
            changeOrigin: true,     //跨域
            // pathRewrite: {'^/api': '/'} //去除请求前缀，保证交给后台服务器的是正常请求地址(必须配置)
        }),
    
        createProxyMiddleware("/api",{  //   这个/api，就是识别的请求路径拼接，告诉请求，当什么请求时，需要用到这里跨域
            target: "https://www.standpoint.top",
            changeOrigin: true,     //跨域
            // pathRewrite: {'^/api': '/'} //去除请求前缀，保证交给后台服务器的是正常请求地址(必须配置)
        })
    )
        
}
