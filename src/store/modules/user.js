import { getToken, setToken, getUser, setUser, removeToken } from "@/utils/auth"

import { login, getUserInfo, logout } from "@/api/login"

const user = {
    state: {
        token: getToken(),      //getToken()作为token初始值，解决页面刷新之后token为null
        user: getUser(),
    },

    mutations: {
        SET_TOKEN(state, token) {
            state.token = token
            setToken(token)
        },
        SET_USER(state, user) {
            state.user = user
            setUser(user)
        }
    },

    actions: {
        //登录获取token
        Login({ commit }, form) {
            //resove触发成功之后的处理,reject触发了异常处理
            return new Promise((resove, reject) => {

                login(form.username.trim(), form.password).then(response => {
                    const resp = response.data
                    commit("SET_TOKEN", resp.data.token)
                    //通知组件已经将token更新成功
                    resove(resp)
                }).catch(error=>{
                    reject(error)
                })

            })
        },

        //通过token获取用户信息
        GetUserInfo({commit,state}){
            return new Promise((resove,reject)=>{
                getUserInfo(state.token).then(response=>{
                    const respUser = response.data
                    commit("SET_USER",respUser.data)
                    resove(respUser)
                }).catch(error=>{
                    reject(error)
                })
            })
            
        },

        Logout({commit,state}){
            return new Promise((resove,reject)=>{
                logout(state.token).then(response=>{
                    const resp = response.data
                    commit("SET_TOKEN",null)
                    commit("SET_USER",null)
                    removeToken()
                    resove(resp)
                })
            }).catch(error=>{
                reject(error)
            })
        }
    }

}

export default user