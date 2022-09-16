<template>
  <div class="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-table :data="rightsList" style="width: 100%" stripe border>
        <el-table-column type="index" label="#" width="120"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="{row:{level}}">
            <el-tag v-if="level==='0'">一级</el-tag>
            <el-tag type="success" v-else-if="level==='1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "rights",
  data() {
    return {
      rightsList: [],
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    getRightsList() {
      this.$axios
        .get("rights/list")
        .then((res) => {
          // console.log(res.data);
          this.rightsList = res.data.data;
          return this.$message.success(res.data.meta.msg);
        })
        .catch((err) => this.$message.error("获取权限列表失败"));
    },
  },
};
</script>

<style lang="less" scoped></style>
