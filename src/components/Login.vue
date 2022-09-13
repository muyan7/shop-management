<template>
  <div class="login">
    <div class="login_center">
      <!-- 头像 -->
      <div class="login_avator">
        <img src="../assets/logo.png" title="Login" />
      </div>
      <!-- 表单区域 -->
      <el-form
        ref="loginFrom"
        :model="loginForm"
        :rules="loginFromRules"
        label-width="0"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <!-- 提交与取消 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="loginUser" class="loginIn">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {throttle} from "lodash";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginFromRules: {
        // 验证
        username: [
          { required: true, message: "请输入您哇塞的网名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请告诉您的密码给我", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 重置表单
    resetLoginForm() {
      this.$refs.loginFrom.resetFields();
    },
    // 登录
    loginUser: throttle(function () {
      this.$refs.loginFrom.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$axios.post("login", this.loginForm);
        if (res.meta.status === 200) {
          this.$message.success("Login successed");
        window.sessionStorage.setItem('token',res.data.token)
        this.$router.push('/home')
        } else {
          return this.$message.error("Login failed");
        }
      });
    }, 1000),
  },
  
};
</script>

<style lang="less" scoped>
.login {
  background-color: #acffe2;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_center {
    width: 550px;
    height: 350px;
    background-color: rgb(195, 249, 134);
    border: 5px solid rgb(255, 0, 0);
    border-radius: 20px;
    position: absolute;
    .login_avator {
      width: 140px;
      height: 140px;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .login_form {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 70px;
      box-sizing: border-box;
      .btns {
        display: flex;
        width: 100%;
        justify-content: center;
        .loginIn{
          margin-right: 40px;
        }
      }
    }
  }
}
</style>
