<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <!-- 添加商品区 -->
      <!-- 搜索区 -->
      <el-row :gutter="20" class="boxcard">
        <el-col :span="10"
          ><el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @keyup.enter.native="getGoodsList"
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="2"
          ><el-button type="primary" size="small" round @click="goAddGoodsList"
            >添加商品</el-button
          ></el-col
        >
      </el-row>
      <!-- 列表渲染区 -->
      <el-table :data="goodsList">
        <el-table-column type="index" label="#" width="80px"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格（元）"
          width="100px"
        >
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="90px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140px">
          <template v-slot="scoped">
            <span>{{ scoped.row.add_time | formatTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190px">
          <template v-slot="scoped">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeById(scoped.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "List",
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      // 商品总数
      total: 0,
      // 商品列表
      goodsList: [],
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 获取页面函数
    async getGoodsList() {
      const { data: res } = await this.$axios("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) return this.$message.error("获取失败");
      this.$message.success(res.meta.msg);
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    // 分页器
    // 页面大小的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    // 当前页面的改变
    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage;
      this.getGoodsList();
    },
    // 删除商品
    async removeById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("已取消删除");
      const { data: res } = await this.$axios.delete(`goods/${id}`);
      if (res.mata.status !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功")
      this.getGoodsList()
    },
    // 添加商品
    goAddGoodsList(){
      this.$router.push('/goods/add')
    }
  },
};
</script>

<style lang="less" scoped>
.boxcard {
  display: flex;
  align-items: center;
}
</style>
