import axios from 'axios'
import { Loading, Message } from 'element-ui';

// Loading.service({target:"body"});
const loading = {
    loadingInstance: null,
    //打开加载
    open: function () {
        if (this.loadingInstance === null) {
            //创建单例模式，如果实例为空，则创建
            this.loadingInstance = Loading.service({
                target: ".main",
                text: "拼命加载中...",
                background: 'rgba(0, 0, 0, 0.5)'
            });
        }

    },
    //关闭加载
    close: function () {
        if (this.loadingInstance !== null) {
            this.loadingInstance.close()
        }
        this.loadingInstance = null
    }
}


const request = axios.create({
    // baseURL:'/',
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000    //设置请求超时时间
})

//请求拦截器
request.interceptors.request.use(config => {
    //请求的拦截
    loading.open()
    return config
}, error => {
    //出现异常的时候
    loading.close()
    return Promise.reject(error)
})

//响应拦截器
request.interceptors.response.use(response => {
    loading.close()
    const resp = response.data
    //后台正常响应的状态，如果不是2000，说明后台处理有问题
    if (resp.code !== 2000) {
        Message({
            message: resp.message || "系统异常",
            type: "warning",
            duration: 5 * 1000
        })
    }
    return response
}, error => { 
    loading.close()
    console.log('response.error:',error.response.status)
    Message({
        message:error.message,
        type:"error",
        duration: 5 * 1000
    })
    return Promise.reject(error)
})

// request.get('db.json').then(response =>{
//     console.log(response.data)
// })
export default request