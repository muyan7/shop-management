<template>
  <el-container class="container">
    <el-header>
      <div class="logo">
        <img src="../assets/images/avator.png" />
        <h2>电商后台娱乐系统</h2>
      </div>
      <div class="logout">
        <el-button type="info" @click="logoutInfo" size="mini" round>退出登录</el-button>
      </div>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <el-aside :width="dataCollapse ? '64px' : '200px'">
        <div class="closeCollapse" @click="closeCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu
          background-color="rgb(224, 250, 184)"
          text-color="#fff"
          unique-opened
          :collapse="dataCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in asideMenuList"
            :key="item.id"
          >
            <!-- 模板区 -->
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="`/${subItem.path}`"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="getActive(subItem.path)"
            >
              <template slot="title">
                <span >{{ subItem.authName }}</span>
              </template></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!--二级路由 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      asideMenuList: [],
      iconObj: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      dataCollapse: false,
      activePath: window.sessionStorage.getItem('path')||"",
    };
  },
  // 获取请求来的菜单栏
  created() {
    this.getAsideMenu();
  },
  methods: {
    // 退出登录
    logoutInfo() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    // 菜单请求
    async getAsideMenu() {
      const { data: res } = await this.$axios.get("menus");
      // console.log(res);
      if (res.meta.status === 200) this.asideMenuList = res.data;
      else this.$message.error(res.meta.msg);
    },
    // 折叠菜单栏
    closeCollapse() {
      this.dataCollapse = !this.dataCollapse;
    },
    // 获取类名
    getActive(value) {
      this.activePath = `/${value}`;
      window.sessionStorage.setItem('path',`/${value}`)
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
}
.el-header {
  background-color: rgb(250, 241, 186);
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 60px;
    }
    h2 {
      color: #fff;
      margin-left: 20px;
    }
  }
  .logout {
    line-height: 60px;
    .el-button {
      width: 90px;
    }
  }
}
.el-aside {
  background-color: rgb(224, 250, 184);
  .el-menu {
    border-right: none;
  }
  .el-submenu {
    i {
      margin-right: 10px;
    }
  }
  .closeCollapse {
    width: 100%;
    background-color: #fcea7f;
    color: #fff;
    text-align: center;
    height: 30px;
    line-height: 30px;
    letter-spacing: 0.3em;
    cursor: pointer;
  }
}
.el-main {
  background-color: rgb(177, 251, 251);
}
</style>
