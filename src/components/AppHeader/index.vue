<template>
  <div class="header">
    <a href="#/">
      <img class="logo" src="@/assets/logo.png" alt />
      <span class="company">会员管理系统</span>
    </a>

    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{user.name}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit" command="a">修改密码</el-dropdown-item>
        <el-dropdown-item icon="el-icon-s-unfold" command="b">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- 弹出修改密码 -->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        style="width:400px"
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="原密码" prop="oldPass">
          <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { logout } from "@/api/login";
import passwordApi from "../../api/password";
export default {
  data() {
    //在return上面进行声明自定义校验
    var validateOldPass = (rule, value, callback) => {
      passwordApi.checkPwd(this.user.id, value).then(response => {
        const resp = response.data;
        if (resp.flag) {
          //验证通过
          callback();
          // console.log("请求了原密码api");
        } else {
          callback(new Error(resp.message));
        }
      });
    };

    //校验确认密码是否一致
    const validateChekPass = (rule, value, callback) => {
      //value是ruleForm.checkPass
      if (value != this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      // user: JSON.parse(localStorage.getItem("msm-user")),
      user:this.$store.state.user.user,
      dialogFormVisible: false,
      ruleForm: {
        oldPass: "",
        pass: "",
        checkPass: ""
      },
      rules: {
        oldPass: [
          { required: true, message: "原密码不能为空", trigger: "blur" },
          { validator: validateOldPass, trigger: "blur" }
        ],
        pass: [{ required: true, message: "密码不能为空", trigger: "blur" }],
        checkPass: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { validator: validateChekPass, trigger: "change" }
        ]
      }
    };
  },

  methods: {
    handleCommand(command) {
      switch (command) {
        case "a":
          //打开修改密码
          this.handlePwd();
          break;
        case "b":
          //退出系统
          this.handelLoginout();
          break;

        default:
          break;
      }
    },

    //打开修改密码
    handlePwd() {
      // this.$message(`点击了修改密码`);
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
      });
    },
    //退出系统
    handelLoginout() {
      this.$store
        .dispatch("Logout")
        .then(response => {
          if (response.flag) {
            //退出成功
            this.$router.push("/login");
          } else {
            this.$message({
              message: resp.message,
              type: "warning",
              duration: 1000
            });
          }
        })
        .catch({});
      // logout(localStorage.getItem("msm-token")).then(response => {
      //   const resp = response.data;
      //   if (resp.flag) {
      //     //退出成功，清除本地的数据,然后回到登录页面重新登录
      //     localStorage.removeItem("msm-token");
      //     localStorage.removeItem("msm-user");
      //     this.$router.push("/login");
      //   } else {
      //     this.$message({
      //       message: resp.message,
      //       type: "warning",
      //       duration: 1000
      //     });
      //   }
      // });
    },

    //修改密码
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log("校验成功");
          passwordApi
            .update(this.user.id, this.ruleForm.pass)
            .then(response => {
              const resp = response.data;
              this.$message({
                message: resp.message,
                type: resp.flag ? "success" : "warning"
              });
              if (resp.flag) {
                //更新成功,退出系统，回到登录页
                this.handelLoginout();
                this.dialogFormVisible = false;
              }
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.logo {
  width: 50px;
  vertical-align: middle;
  padding: 0px 10px 0 40px;
}
.company {
  position: absolute;
  color: white;
}
.el-dropdown {
  float: right;
  margin-right: 40px;
}
.el-dropdown-link {
  cursor: pointer;
  color: white;
}
</style>