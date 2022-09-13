<template>
  <div>
    <el-button type="info" @click="logoutInfo">退出登录</el-button>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    logoutInfo() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="less" scoped></style>
