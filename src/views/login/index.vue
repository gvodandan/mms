<template>
  <div class="login-container">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" class="login-form">
      <h2 class="login-title">会员管理系统</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login, getUserInfo } from "@/api/login.js";
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        // console.log("valid", valid);
        if (valid) {
          const pro = this.$store.dispatch("Login",this.form)
          // console.log("pro:",pro)
          pro.then(response=>{
            if(response.flag){
              //不获取用户信息直接跳转到首页，因为有loading
              this.$router.push("/")
              // console.log("this.$route.path",this.$route.path)
            }else{
              this.$message({
                message:response.message,
                type:"warning"
              })
            }
          }).catch(error=>{
            
          })
          /*login(this.form.username, this.form.password).then(response => {
            const resp = response.data;
            // console.log("login.response.data", resp, resp.data.token);
            if (resp.flag) {
              //验证成功,通过token去获取用户信息
              getUserInfo(resp.data.token).then(response => {
                //获取到了用户的数据
                const respUser = response.data;
                if (respUser.flag) {
                  // console.log("getUserInfo", respUser, respUser.data);
                  //保存token，用户信息
                  localStorage.setItem(
                    "msm-user",
                    JSON.stringify(respUser.data)
                  );
                  localStorage.setItem("msm-token", resp.data.token);
                  //前往首页
                  this.$router.push("/");
                } else {
                  //获取信息失败
                  this.$message({
                    message: respUser.massage,
                    type: "warning",
                    center: true
                  });
                }
              });
            } else {
              //未通过
              // alert(resp.massage)
              this.$message({
                message: resp.massage,
                type: "warning",
                center: true
              });
            }
          });*/
        } else {
          // console.log("验证失败");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
}
.login-container::before {
  content: "";
  opacity: 0.8;
  filter: opacity(80%);
  background: url("../../assets/login.jpg");
  z-index: -1;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
}
.login-form {
  width: 350px;
  margin: 160px auto;
  background-color: rgb(255, 255, 255, 0.8);
  padding: 4%;
  border-radius: 20px;
  z-index: -1;
}

.login-title {
  color: darkgoldenrod;
  text-align: center;
}
</style>