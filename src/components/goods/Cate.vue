<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card class="box-card">
      <el-row class="elRow">
        <el-col>
          <el-button type="primary" @click="addGoodsCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
      >
        <!-- 是否有效 -->
        <template #custom="scoped">
          <i
            class="el-icon-success"
            v-if="scoped.row.cat_deleted === false"
            :style="{ color: 'lightgreen' }"
          ></i>
          <i class="el-icon-error" v-else :style="{ color: 'hotpink' }"></i>
        </template>
        <!-- 排序 -->
        <template #sort="scoped">
          <el-tag size="mini" v-if="scoped.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scoped.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template #operation="{ row }">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editGoodsCate(row)"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
          @click="deleteGoodsCate(row)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryInfo.total"
      >
      </el-pagination>
    </el-card>
    <!-- 弹框区 -->
    <!-- 添加分类 -->
    <el-dialog
      title="添加分类"
      :visible.sync="CateDialogVisible"
      width="40%"
      @close="addCateDialogClose"
    >
      <!-- 表单 -->
      <el-form
        label-width="80px"
        :model="addCateInfo"
        :rules="addCateRules"
        ref="addCateRef"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateInfo.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!--options用来指定数据源  -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            :options="parentCateList"
            :props="cascaderProps"
            v-model="selectKeys"
            @change="parentCateChanged"
            expand-trigger="hover"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="CateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑弹框 -->
    <el-dialog title="提示" :visible.sync="editCateDialogVisible" width="40%">
      <el-form
        label-width="100px"
        :model="editCateInfo"
        :rules="editCateRules"
        ref="editCateRef"
        ><el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="editCateInfo.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendEditInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
        total: 0,
      },
      // 表格的列属性
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 将当前列定义为模板列
          type: "template",
          // 当前模板列的名称
          template: "custom",
        },
        {
          label: "排序",
          // 将当前列定义为模板列
          type: "template",
          // 当前模板列的名称
          template: "sort",
        },
        {
          label: "操作",
          // 将当前列定义为模板列
          type: "template",
          // 当前模板列的名称
          template: "operation",
        },
      ],
      // 添加分类对话框显示与隐藏
      CateDialogVisible: false,
      // 添加分类的表单数据项
      addCateInfo: {
        cat_name: "",
        cat_pid: 0, //父级分类的id.默认为0
        cat_level: 0, //分类的等级，默认为1级
      },
      // 验证规则
      addCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      //父级分类的数据
      parentCateList: [],
      // 指定联级选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 选中的父级分类的id数组
      selectKeys: [],
      // 编辑
      editCateDialogVisible: false,
      // 编辑的表单验证
      editCateInfo: {
        cat_name: "",
        cat_id: "",
      },
      // 编辑的表单验证
      editCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCateList();
  },

  methods: {
    // 获取商品分类
    getCateList() {
      this.$axios
        .get("categories", { params: this.queryInfo })
        .then((res) => {
          this.cateList = res.data.data.result;
          this.queryInfo.total = res.data.data.total;
          this.$message.success(res.data.meta.msg);
        })
        .catch((err) => this.$message.error("获取商品分类失败"));
    },
    // 监听分页器的处理函数pagesize
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听当前页面的改变pagenum
    handleCurrentChange(currentPage) {
      // console.log(currentPage);
      this.queryInfo.pagenum = currentPage;
      this.getCateList();
    },
    // 添加分类的对话框
    addGoodsCateDialog() {
      // 获取父级分类数据
      this.getParentCateList();
      this.CateDialogVisible = true;
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$axios.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取父级分类数据失败");
      // console.log(res.data);
      this.parentCateList = res.data;
    },
    // 父级分类的数据列表选择项发生改变
    parentCateChanged() {
      // console.log(this.selectKeys);
      // 判断selectKeys数组是否存在，来判断是不是选择了父级分类
      if (this.selectKeys.length > 0) {
        // 父级分类的id
        this.addCateInfo.cat_pid = this.selectKeys[this.selectKeys.length - 1];
        // 为当前分类的等级赋值
        this.addCateInfo.cat_level = this.selectKeys.length;
        return;
      } else {
        this.addCateInfo.cat_pid = 0;
        this.addCateInfo.cat_level = 0;
      }
    },
    // 确认添加事件
    addCate() {
      // console.log(this.addCateInfo);
      this.$refs.addCateRef.validate(async (valid) => {
        if (!valid) return this.$message.error("提交失败");
        const { data: res } = await this.$axios.post(
          "categories",
          this.addCateInfo
        );
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error("添加失败");
        this.$message.success(res.meta.msg);
        this.getCateList();
        this.CateDialogVisible = false;
      });
    },
    // 对话框关闭后清空
    addCateDialogClose() {
      this.$refs.addCateRef.resetFields();
      this.selectKeys = [];
      this.addCateInfo.cat_pid = 0;
      this.addCateInfo.cat_level = 0;
    },
    // 编辑
    editGoodsCate(row) {
      this.editCateDialogVisible = true;
      this.$axios
        .get(`categories/${row.cat_id}`)
        .then((res) => {
          this.editCateInfo = res.data.data;
          return this.$message.success(res.data.meta.msg);
        })
        .catch((err) => this.$message.error("获取失败"));
    },
    //发送编辑数据
    sendEditInfo() {
      this.$refs.editCateRef.validate(async (valid) => {
        if (!valid) return this.$message.error("提交失败");
        const { data: res } = await this.$axios.put(
          `categories/${this.editCateInfo.cat_id}`,
          {
            cat_name: this.editCateInfo.cat_name,
          }
        );
        if (res.meta.status !== 200) return this.$message.error("更新失败");
        this.editCateDialogVisible = false;
        this.editCateInfo.cat_name = "";
        this.editCateInfo.cat_id = "";
        this.getCateList();
      });
    },
    // 删除功能
    deleteGoodsCate(row){
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios.delete(`categories/${row.cat_id}`).then((res) => {
            this.getCateList();
          });
          return this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() =>
          this.$message({
            type: "info",
            message: "已取消删除",
          })
        );
    }
  },
};
</script>

<style lang="less" scoped>
.elRow {
  margin-bottom: 20px;
}
.el-cascader {
  width: 100%;
}
</style>
