import Vue from "vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App.vue";
import router from "./router";
import './permission'   //权限拦截
import store from "./store"

Vue.use(ElementUI);
Vue.config.productionTip = process.env.NODE_ENV==='production';
console.log("process.env.NODE_ENV",process.env.NODE_ENV)
console.log("process.env.VUE_APP_SERVICE_URI",process.env.VUE_APP_SERVICE_URI)

new Vue({
  router,
  store,    //注册到vue实例中
  render: h => h(App)
}).$mount("#app");
