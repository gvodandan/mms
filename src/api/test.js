import request from '@/utils/request'

// const BASE_URI = process.env.VUE_APP_BASE_API
// request.get('./db.json').then(response=>{
//     console.log(response.data)
// })

//2.以对象的方式配置请求方式
// request({
//     method:'get',
//     url:'db.json',
// }).then(response=>{
//     console.log("get2"+response.data)
// })


export default {
    getList(){
        const req = request({
            method:'get',
            url:'/db.json',
        })
        console.log(req)    //Promise异步对象，可以调用.then()函数
        return req
    }
}