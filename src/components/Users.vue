<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索区 -->
      <el-row :gutter="20" class="boxcard">
        <el-col :span="10"
          ><el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            @clear="getUserList"
            clearable
            @keyup.native.enter="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="2"
          ><el-button
            type="primary"
            size="small"
            round
            @click="addDialogVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格区 -->
      <el-table :data="userList" style="width: 100%" stripe border>
        <el-table-column type="index" label="序号" width="80px">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="120px">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180px">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180px">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="150px">
        </el-table-column>
        <el-table-column label="状态" width="150px">
          <template v-slot="scoped">
            <el-switch
              v-model="scoped.row.mg_state"
              active-color="aqua"
              inactive-color="gold"
              @change="changeStatus(scoped.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" class="operation">
          <template v-slot="scoped">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              circle
              @click="showEditDialogVisible(scoped.row.id)"
            ></el-button>
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              circle
              @click="removeUserInfo(scoped.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                size="small"
                icon="el-icon-star-off"
                circle
                @click="allotRights(scoped.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹窗区 -->
      <!-- 添加用户 -->
      <el-dialog
        title="添加用户"
        width="40%"
        :visible.sync="addDialogVisible"
        @close="addDialogClose"
      >
        <el-form
          label-width="70px"
          :model="addFormInfo"
          :rules="addFormRules"
          ref="addFormRef"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addFormInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addFormInfo.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addFormInfo.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model.number="addFormInfo.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户 -->
      <el-dialog
        title="修改用户"
        width="40%"
        :visible.sync="editDialogVisible"
        @close="editDialogClose"
      >
        <el-form
          label-width="70px"
          ref="editFormRef"
          :model="editFormInfo"
          :rules="editFormRules"
        >
          <el-form-item label="用户名">
            <el-input v-model="editFormInfo.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editFormInfo.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editFormInfo.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限 -->
      <el-dialog title="提示" :visible.sync="RightDialogVisible" width="40%" @close="setDialogClose">
        <div>
          <p>当前的用户：{{ rightInfo.username }}</p>
          <p>当前的角色：{{ rightInfo.role_name }}</p>
          <p>
            分配新角色：
            <el-select v-model="rightValueId" placeholder="请选择角色">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </p>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="RightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sendRightsRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    // 自定义验证规则
    let checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) {
        return callback();
      }
      //返回一个错误提示
      callback(new Error("请输入合法的邮箱"));
    };
    let checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      //返回一个错误提示
      callback(new Error("请输入合法的手机号码"));
    };
    return {
      userList: [],
      total: 0,
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      // 显示添加表单
      addDialogVisible: false,
      // 添加表单区域
      addFormInfo: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加表单的验证
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
      // 编辑表单
      editDialogVisible: false,
      // 编辑表单
      editFormInfo: {},
      // 编辑表单的验证
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
      // 权限框
      RightDialogVisible: false,
      // 权限框内用户信息
      rightInfo: {},
      // 权限框内的角色列表
      rolesList: [],
      // 更改角色的id
      rightValueId: "",
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取数据列表
    async getUserList() {
      const { data: res } = await this.$axios.get("users", {
        params: this.queryInfo,
      });
      // console.log(res);
      if (res.meta.status === 200) {
        this.userList = res.data.users;
        this.total = res.data.total;
      } else this.$message.error(res.meta.msg);
    },
    // 页面数据展示的条数
    handleSizeChange(value) {
      this.queryInfo.pagesize = value;
      this.getUserList();
    },
    // 当前页
    handleCurrentChange(value) {
      this.queryInfo.pagenum = value;
      this.getUserList();
    },
    // 改变状态
    changeStatus: _.throttle(function (value) {
      this.$axios
        .put(`users/${value.id}/state/${value.mg_state}`)
        .then((res) => {
          // console.log(this);
          this.$message.success(res.data.meta.msg);
        })
        .catch((err) => this.$message.error(err.data.meta.msg));
    }, 1000),
    // 添加表单的重置事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加表单的提交后台行为
    addUserInfo() {
      this.$refs.addFormRef.validate((valid) => {
        // console.log(valid);boolean值
        if (!valid) return this.$message.error("提交失败");
        // 发起添加请求
        this.$axios.post("users", this.addFormInfo).then((res) => {
          this.addDialogVisible = false;
          this.getUserList();
          return this.$message.success(res.data.meta.msg);
        });
      });
    },
    // 显示修改表单的功能
    showEditDialogVisible(id) {
      this.editDialogVisible = true;
      this.$axios
        .get(`users/${id}`)
        .then((res) => {
          this.editFormInfo = res.data.data;
          return this.$message.success(res.data.meta.msg);
        })
        .catch((err) => this.$message.error("获取失败"));
    },
    // 编辑表单的重置事件
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    // 编辑表单的后续行为
    editUserInfo() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return this.$message.error("修改失败");
        // 发起修改请求
        this.$axios
          .put(`users/${this.editFormInfo.id}`, {
            email: this.editFormInfo.email,
            mobile: this.editFormInfo.mobile,
          })
          .then((res) => {
            this.editDialogVisible = false;
            this.getUserList();
            return this.$message.success(res.data.meta.msg);
          })
          .catch((err) => this.$message.error("更新失败"));
      });
    },
    // 根据id删除对应的用户信息
    removeUserInfo(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios.delete(`users/${id}`).then((res) => {
            this.getUserList();
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
    // 分配角色权限
    async allotRights(row) {
      this.rightInfo = row;
      // 获取角色列表
      const { data: res } = await this.$axios.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败！");
      this.rolesList = res.data;
      this.RightDialogVisible = true;
    },
    // 更改角色
    async sendRightsRoles() {
      if (!this.rightValueId) return this.$message.error("请选择要分配的角色");
      const { data: res } = await this.$axios.put(
        `users/${this.rightInfo.id}/role`,
        { rid: this.rightValueId }
      );
      if (res.meta.status !== 200) return this.$message.error("分配角色失败！");
      this.$message.success(res.meta.msg);
      this.getUserList();
      this.RightDialogVisible = false;
    },
    // 权限管理框的关闭事件
    setDialogClose(){
      this.rightInfo={}
      this.rightValueId = "";
    }
  },
};
</script>

<style lang="less" scoped>
.boxcard {
  line-height: 40px;
  .operation {
    display: flex;
  }
}
</style>
