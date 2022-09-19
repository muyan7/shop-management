<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 提示 -->
      <el-row>
        <el-alert
          title="提示商品信息"
          type="info"
          show-icon
          :closable="false"
          center
        >
        </el-alert
      ></el-row>
      <!-- 进度条 -->
      <el-steps
        :space="200"
        :active="completedActive * 1"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 包裹表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="completedActive"
          :before-leave="changeTabEvent"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateInfoList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="attr"
                  v-for="(attr, index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传到后台的Api地址 -->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 弹框区 -->
    <el-dialog title="图片预览" :visible.sync="picDialogVisible" width="50%">
      <img :src="previewPath" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: "Add",
  data() {
    return {
      // 步骤条
      completedActive: 0,
      // 基本信息
      // 表单数据
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 选择的商品分类三级id
        goods_cat: [],
        // 图片上传路径
        pics: [],
        // 商品的富文本详情
        goods_introduce: "",
        // 提交表单的动态与静态参数
        attrs: [],
      },
      // props的校验规则
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      // 商品分类
      cateInfoList: [],
      // 商品分类的配置项
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 获取动态many参数数据
      manyTableData: [],
      // 获取静态only参数数据
      onlyTableData: [],
      // 图片上传的请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 点击图片预览地址
      previewPath: "",
      // 图片对话框的显示与隐藏
      picDialogVisible: false,
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      // 1.6.1接口文档获取商品分类的数据列表
      const { data: res } = await this.$axios("categories");
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      this.$message.success(res.meta.msg);
      this.cateInfoList = res.data;
    },
    // 三级联动选择变化的触发事件
    handleChange(key) {
      // console.log(this.addForm.goods_cat===key); //true
      if (key.length !== 3) return (this.addForm.goods_cat = []);
    },
    // 标签页跳转的事件
    changeTabEvent(activeName, oldActiveName) {
      // console.log(activeName, oldActiveName); //绑定的是name值 1,0
      if (this.addForm.goods_cat.length !== 3 && oldActiveName === "0") {
        this.$message.error("请选择商品分类");
        return false;
      }
      return true;
    },
    // 点击标签页事件
    async tabClicked(Anode) {
      // Anode是vc实例.动态参数页面
      if (Anode.index === "1" && this.addForm.goods_cat.length === 3) {
        const { data: res } = await this.$axios(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "many",
            },
          }
        );

        if (res.meta.status !== 200)
          return this.$message.error("获取动态参数失败");
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        console.log(res.data);
        this.manyTableData = res.data;
        console.log(this.manyTableData, "动态参数");
        this.$message.success(res.meta.msg);
      } else if (Anode.index === "2" && this.addForm.goods_cat.length === 3) {
        const { data: res } = await this.$axios(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "only",
            },
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("获取静态参数失败");
        this.onlyTableData = res.data;
        console.log(this.onlyTableData, "静态参数");
      }
    },
    // 处理图片预览
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.picDialogVisible = true;
    },
    // 处理移出图片的函数
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      //  this.addForm.pics=this.addForm.pics.filter(item=>)
      const id = this.addForm.pics.findIndex((item) => item.pic === filePath);
      this.addForm.pics.splice(id, 1);
    },
    // 图片上传成功的事件
    uploadSuccess(response) {
      // console.log(response);
      // 1.拼接得到一个图片信息对象
      // 2.将图片信息对象push到addForm.pics数组之中
      const picInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
    },
    // 添加商品
    addGoods() {
      this.$refs.addFormRef.validate( async (valid) => {
        if (!valid) this.$message.error("请填写必要的表单项！");
        // 因为三级菜单列表cascader必须是数组，但是表单提交goods_cat时又需要是字符串，所以这里直接修改成字符串就会出现报错，则需要借助深拷贝来实现。
        const newAddForm = _.cloneDeep(this.addForm);
        newAddForm.goods_cat = newAddForm.goods_cat.join(",");
        // 处理动态参数
        this.manyTableData.forEach((item) => {
          const manyInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(manyInfo);
        });
        // 处理静态参数
        this.onlyTableData.forEach((item) => {
          const onlyInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addForm.attrs.push(onlyInfo);
        });
        newAddForm.attrs = this.addForm.attrs;
        console.log(newAddForm);
        // 发起请求添加商品
        // 商品名称必须是唯一的
      const {data:res} = await  this.$axios.post('goods',newAddForm)
      if(res.meta.status!==201) return this.$message.error('添加商品失败')
      this.$message.success(res.meta.msg)
      // 编程式导航跳转到商品列表区
      this.$router.push('/goods')
      });
    },
  },
  computed: {
    // 计算出每一个三级分类的id
    cateId() {
      if (this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2];
      return null;
    },
  },
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 3px;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
