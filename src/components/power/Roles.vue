<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesdialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="rolesList">
        <el-table-column type="expand" width="120px">
          <template v-slot="{ row }">
            <el-row
              v-for="(item1, index) in row.children"
              :key="item1.id"
              :class="['bdbottom', index === 0 ? 'bdtop' : '', 'flexdec']"
            >
              <!-- 一级权限 -->
              <el-col :span="6"
                ><el-tag closable @close="removeRightsById(row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i
              ></el-col>
              <el-col :span="18">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 === 0 ? '' : 'bdtop', 'flexdec']"
                >
                  <el-col :span="8"
                    ><el-tag
                      closable
                      type="success"
                      @close="removeRightsById(row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i
                  ></el-col>
                  <el-col :span="16">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightsById(row, item3.id)"
                      >{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" width="120px"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scoped">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="editRoles(scoped.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="deleteRoles(scoped.row)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="small"
              icon="el-icon-star-off"
              @click="showRightDialog(scoped.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹框区 -->
      <!-- 添加角色 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addRolesdialogVisible"
        width="40%"
        @close="addRolesInfoClose"
      >
        <el-form
          label-width="80px"
          :model="addRolesInfo"
          :rules="addRolesrules"
          ref="addRolesRef"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRolesInfo.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRolesInfo.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRolesdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRolesInfoConfirm"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 编辑角色 -->
      <el-dialog
        title="编辑角色"
        :visible.sync="editRolesdialogVisible"
        width="40%"
      >
        <el-form
          label-width="80px"
          :model="editRolesInfo"
          :rules="editRolesrules"
          ref="editRolesRef"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRolesInfo.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRolesInfo.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRolesdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRolesInfoConfirm"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 分配权限 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="40%"
        @close="clearCheckedRight"
      >
        <!-- 树形结构 -->
        <el-tree
          :data="rightList"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="checkedRight"
          :props="defaultProps"
          ref="getRightRef"
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRight">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      // 添加角色弹框
      addRolesdialogVisible: false,
      // 添加角色的数据
      addRolesInfo: {
        roleName: "",
        roleDesc: "",
      },
      // 验证添加角色
      addRolesrules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请描述简单角色", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
      rolesList: [],
      // 编辑角色
      // 弹框
      editRolesdialogVisible: false,
      editRolesInfo: {
        roleName: "",
        roleDesc: "",
      },
      // 编辑验证
      editRolesrules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请描述简单角色", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
      // 分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 权限列表，渲染树形结构
      rightList: [],
      // 分配权限的id值
      RightRoleId: '',
      // 树形结构的属性绑定对象
      defaultProps: {
        children: "children", //嵌套的关节点
        label: "authName",
      },
      // 树形结构默认被勾选状态
      checkedRight: [],
      // 分配被选中的树形结构状态
    };
  },
  created() {
    this.getRolesInfo();
  },
  methods: {
    // 获取角色列表
    getRolesInfo() {
      this.$axios
        .get("roles")
        .then((res) => {
          this.rolesList = res.data.data;
          return this.$message.success(res.data.meta.msg);
        })
        .catch((err) => this.$message.error("获取失败"));
    },
    // 添加角色
    addRolesInfoConfirm() {
      this.$refs.addRolesRef.validate((valid) => {
        if (!valid) return this.$message.error("提交失败");
        this.$axios.post("roles", this.addRolesInfo).then((res) => {
          this.addRolesdialogVisible = false;
          this.getRolesInfo();
          return this.$message.success(res.data.meta.msg);
        });
      });
    },
    // 表单的重置
    addRolesInfoClose() {
      this.$refs.addRolesRef.resetFields();
    },
    // 编辑角色
    editRoles({ id }) {
      this.editRolesdialogVisible = true;
      this.$axios
        .get(`roles/${id}`)
        .then((res) => {
          console.log(res.data.data);
          this.editRolesInfo = res.data.data;
          return this.$message.success(res.data.meta.msg);
        })
        .catch((err) => this.$message.error("获取失败"));
    },
    // 表单确认编辑角色
    editRolesInfoConfirm() {
      this.$refs.editRolesRef.validate((valid) => {
        // console.log(this.editRolesInfo.roleId);
        if (!valid) return this.$message.error("提交失败");
        this.$axios
          .put(`roles/${this.editRolesInfo.roleId}`, this.editRolesInfo)
          .then((res) => {
            this.editRolesdialogVisible = false;
            this.getRolesInfo();
            return this.$message.success(res.data.meta.msg);
          });
      });
    },
    // 删除角色
    deleteRoles({ id }) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios.delete(`roles/${id}`).then((res) => {
            this.getRolesInfo();
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
    // 删除权限
    removeRightsById(roles, RightsId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .delete(`roles/${roles.id}/rights/${RightsId}`)
            .then((res) => {
              roles.children = res.data.data;
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
    // 分配权限对话框
    showRightDialog(row) {
      this.RightRoleId = row.id;
      this.setRightDialogVisible = true;
      this.$axios
        .get("rights/tree")
        .then((res) => {
          this.rightList = res.data.data;
          this.getRightIdByRecursion(row, this.checkedRight);
          return this.$message.success(res.data.meta.msg);
        })
        .catch((err) => this.$message.error("获取数据失败"));
    },
    // 利用递归获取三级权限的id
    getRightIdByRecursion(node, arr) {
      if (node.children)
        node.children.forEach((item) => {
          this.getRightIdByRecursion(item, arr);
        });
      else arr.push(node.id);
    },
    // 关闭权限对话框事件,清空数据
    clearCheckedRight() {
      this.RightRoleId = '';
      this.checkedRight = [];
    },
    // 分配树形结构权限的选择状态
   async allotRight() {
      const keysStr = [
        ...this.$refs.getRightRef.getHalfCheckedKeys(),
        ...this.$refs.getRightRef.getCheckedKeys(),
      ].join(",");
      // console.log(keysStr);
    const {data:res}= await this.$axios.post(`roles/${this.RightRoleId}/rights`,{rids:keysStr})
    if(res.meta.status!==200) return this.$message.error('分配权限失败')
    this.$message.success(res.meta.msg)
    this.getRolesInfo()
    this.setRightDialogVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.addForm {
  padding: 20px;
}
.el-tag {
  margin: 6px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>
