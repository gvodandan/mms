/*
权限校验
通过Vue Router的前置钩子函数beforeEach((to, from, next)
当进行路由跳转之前，进行判断，是否已经登录过，如果登录过则允许访问非登录页面，否则回到登录页
*/
import router from "./router/index"
import {getUserInfo} from "./api/login"
import store from "./store"

router.beforeEach((to,from,next)=>{
    //获取token
    // const token = localStorage.getItem("msm-token")
    const token = store.state.user.token
    // console.log('token:',token)
    //1.1如果没有获取到，要访问非登录页，则不让访问，回到登录页 /login
    if(!token){
        if(to.path!=="/login"){
            next({path:"/login"})
        }else{
            next()
        }
    }else{
        //1.2获取到token
            //1.2.1 请求路由从/login，去目标路由
            if(to.path==="/login"){
                next()
            }else{
                //1.2.2 请求的路由非登录页面，就通过token去获取用户信息
                // const userInfo=localStorage.getItem("msm-user")
                const userInfo = store.state.user.user
                if(userInfo){
                    //本地获取到，则直接去目标路由
                    next()
                }else{
                    //如果本地没有用户信息，就通过token去获取用户信息
                    
                    store.dispatch("GetUserInfo").then(response=>{
                        if(response.flag){
                            next()
                        }else{
                            next({path:"/login"})
                        }
                    }).catch(error=>{

                    })
                }
                

            }
            
    }
    
    
})