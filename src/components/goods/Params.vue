<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-row>
        <el-alert
          title="注意：只允许为第三级分类设置相关参数！"
          type="warning"
          show-icon
          :closable="false"
        >
        </el-alert>
      </el-row>
      <el-row class="elRow">
        <el-col>
          选择商品分类 :<el-cascader
            v-model="selectParamsKeys"
            :options="paramsList"
            :props="paramsProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-row>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <!-- 添加动态参数的面板 -->
          <el-tab-pane label="动态参数" name="many">
            <el-button
              type="primary"
              :disabled="btnDisabled"
              size="mini"
              @click="addAndEditDialogVisible = true"
              >添加参数</el-button
            >
          </el-tab-pane>
          <!-- 添加静态属性的面板 -->
          <el-tab-pane label="静态属性" name="only">
            <el-button
              type="primary"
              :disabled="btnDisabled"
              size="mini"
              @click="addAndEditDialogVisible = true"
              >添加属性</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-row>
      <!-- 表格区 -->
      <el-table
        :data="activeParamsList"
        style="width: 100%"
        border=""
        ref="updataTable"
      >
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template v-slot="scoped">
            <!-- 循环 -->
            <el-tag
              v-for="(item, index) in scoped.row.attr_vals"
              :key="index"
              closable
              @close="handleClose(index, scoped.row)"
            >
              {{ item }}</el-tag
            >
            <!-- 添加 -->
            <el-input
              class="input-new-tag"
              v-if="scoped.row.inputVisible"
              v-model="scoped.row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scoped.row)"
              @blur="handleInputConfirm(scoped.row)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput(scoped.row)"
              >+ New Tag</el-button
            >
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#" width="90px"> </el-table-column>
        <el-table-column
          prop="attr_name"
          :label="activeName === 'many' ? '参数名称' : '属性名称'"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editParamsList(row)"
              >修改</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteParamsList(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 弹框区 -->
    <!-- 添加 -->
    <el-dialog
      :title="`添加${titleDialog}`"
      :visible.sync="addAndEditDialogVisible"
      width="40%"
      @close="addDialogClose"
    >
      <!-- 表单验证 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleDialog" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAndEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAndEditConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog
      :title="`修改${titleDialog}`"
      :visible.sync="editAndEditDialogVisible"
      width="40%"
      @close="editDialogClose"
    >
      <!-- 表单验证 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleDialog" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAndEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAndEditConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      paramsList: [],
      // 级联选择框的配置对象
      paramsProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 联级选择框双向绑定选中的value值
      selectParamsKeys: [],
      // 被激活的页签名称
      activeName: "many",
      // 获取到的动态与静态参数
      activeParamsList: [],
      // 弹框
      // 添加
      addAndEditDialogVisible: false,
      // 弹框的表单验证
      addForm: {
        attr_name: "",
      },
      // 验证规则
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      // 修改
      editAndEditDialogVisible: false,
      editForm: {
        attr_name: "",
        attr_id: "",
      },
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      // 直接设置在每一项的item上了
      /*   // 添加展开行的标签输入框
      inputVisible: false,
      // 表签内的输入框的双向绑定值
      inputValue: "", */
    };
  },
  created() {
    this.getParamsList();
  },
  methods: {
    async getParamsList() {
      const { data: res } = await this.$axios.get("categories");
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error("获取失败");
      this.paramsList = res.data;
      this.$message.success(res.meta.msg);
    },
    // 联级选择框变化，触发的函数
    async handleChange() {
      // 考虑到只能选择最后一层，因此需要判断选择数组的长度，进行相应的赋值。
      await this.getParamsThirdList();
    },
    // Tab页签点击事件的处理函数
    async handleTabClick() {
      await this.getParamsThirdList();
    },
    // 封装请求动态与静态参数的函数。
    async getParamsThirdList() {
      if (this.selectParamsKeys.length !== 3) {
        this.activeParamsList = [];
        this.selectParamsKeys = [];
        return;
      }
      const { data: res } = await this.$axios({
        url: `categories/${this.paramsId}/attributes`,
        params: { sel: this.activeName },
      });
      if (res.meta.status !== 200) return this.$message.error("获取失败");
      this.$message.success(res.meta.msg);
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals === "" ? [] : item.attr_vals.split(" ");
        // 为每一个都添加属于自己的Boolean值
        this.$set(item, "inputVisible", false);
        this.$set(item, "inputValue", "");
      });
      this.activeParamsList = res.data;
      this.getParamsList();
    },
    // 修改功能的弹窗
    async editParamsList(row) {
      this.editAndEditDialogVisible = true;
      const { data: res } = await this.$axios(
        `categories/${this.paramsId}/attributes/${row.attr_id}`,
        {
          attr_sel: this.activeName,
        }
      );
      if (res.meta.status !== 200) return this.$message.error("获取失败");
      this.editForm.attr_name = res.data.attr_name;
      this.editForm.attr_id = res.data.attr_id;
    },
    // 提交修改表单的按钮
    editAndEditConfirm() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$axios.put(
          `categories/${this.paramsId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 200) this.$message.error("修改失败");
        this.$message.success(res.meta.msg);
        this.getParamsList();
        this.editAndEditDialogVisible = false;
      });
    },
    // 删除功能
    deleteParamsList(row) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .delete(`categories/${this.paramsId}/attributes/${row.attr_id}`)
            .then((res) => {
              this.getParamsList();
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
    },
    //添加弹窗关闭功能
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加参数的提交功能
    addAndEditConfirm() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$axios.post(
          `categories/${this.paramsId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) this.$message.error("添加失败");
        this.$message.success(res.meta.msg);
        this.addAndEditDialogVisible = false;
        this.getParamsList();
      });
    },
    // 修改关闭弹窗清空表单
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    // 展开行的输入框，以及添加标签
    async handleInputConfirm(row) {
      row.inputVisible = false;
      if (row.inputValue.trim() === "") {
        row.inputValue = "";
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      this.saveParamsSend(row);
    },
    // 点击事件改变标签与输入框的切换
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.focus();
      });
    },
    //删除标签项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveParamsSend(row);
    },
    //  修改删除后提交的函数
    async saveParamsSend(row) {
      const { data: res } = await this.$axios.put(
        `categories/${this.paramsId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) return this.$message.error("添加失败");
      this.$message.success("添加成功");
      row.inputValue = "";
    },
  },
  computed: {
    // 按钮是否被禁用
    btnDisabled() {
      return this.selectParamsKeys.length === 3 ? false : true;
    },
    // 计算出分类id
    paramsId() {
      if (this.selectParamsKeys.length !== 3) return null;
      return this.selectParamsKeys[2];
    },
    // 计算出弹框属于哪个属性名称
    titleDialog() {
      return this.activeName === "many" ? "动态参数" : "静态属性";
    },
  },
  beforeUpdate() {
    this.$nextTick(() => {
      // 在数据加载完，重新渲染表格
      this.$refs.updataTable.doLayout();
    });
  },
};
</script>

<style lang="less" scoped>
.elRow {
  margin-top: 15px;
}
.el-tag {
  margin: 0 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
