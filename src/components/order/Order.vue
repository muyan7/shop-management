<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="10"
          ><el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单数据列表 -->
      <el-table :data="orderInfoList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot="scoped">
            <el-tag type="success" v-if="scoped.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot="scoped">
            {{ scoped.row.create_time | formatTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scoped">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="editAddress(scoped.row)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              circle
              size="mini"
              @click="showProgressInfo"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹框区 -->
      <!-- 修改信息 -->
      <el-dialog
        title="修改地址"
        width="40%"
        :visible.sync="addAddressVisible"
        @close="addressDialogVisibleClose"
      >
        <el-form
          label-width="90px"
          :model="addressForm"
          :rules="addressFormRules"
          ref="addressFormRef"
        >
          <el-form-item label="省市区/县" prop="addressName" auto>
            <el-cascader
              :options="cityData"
              v-model="addressForm.addressName"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="detailed">
            <el-input v-model="addressForm.detailed"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addAddressVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddress">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 详细物流进度区 -->
      <el-dialog
        title="物流进度"
        width="40%"
        :visible.sync="addAddressDetialsVisible"
      >
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.ftime"
          >
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 15]"
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
import cityData from "./citydata.js"; //导入地区包
export default {
  name: "Order",
  data() {
    return {
      // 渲染页面发起请求的数据列表
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      // 总的页码数
      total: 0,
      // 手机得到的数据列表
      orderInfoList: [],
      // 修改地址的弹框
      addAddressVisible: false,
      // 表单信息
      addressForm: {
        addressName: "",
        detailed: "",
      },
      // 验证表单信息
      addressFormRules: {
        addressName: [
          { required: true, message: "请选择省市区/县", trigger: "blur" },
        ],
        detailed: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      // 地区
      cityData,
      // 物流信息
      addAddressDetialsVisible: false,
      // 物流信息数据
      progressInfo: [
        {
          time: "2018-05-10 09:39:00",
          ftime: "2018-05-10 09:39:00",
          context: "已签收,感谢使用顺丰,期待再次为您服务",
          location: "",
        },
        {
          time: "2018-05-10 08:23:00",
          ftime: "2018-05-10 08:23:00",
          context:
            "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          location: "",
        },
        {
          time: "2018-05-10 07:32:00",
          ftime: "2018-05-10 07:32:00",
          context: "快件到达 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-10 02:03:00",
          ftime: "2018-05-10 02:03:00",
          context:
            "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-09 23:05:00",
          ftime: "2018-05-09 23:05:00",
          context: "快件到达 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 21:21:00",
          ftime: "2018-05-09 21:21:00",
          context: "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 13:07:00",
          ftime: "2018-05-09 13:07:00",
          context: "顺丰速运 已收取快件",
          location: "",
        },
        {
          time: "2018-05-09 12:25:03",
          ftime: "2018-05-09 12:25:03",
          context: "卖家发货",
          location: "",
        },
        {
          time: "2018-05-09 12:22:24",
          ftime: "2018-05-09 12:22:24",
          context: "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          location: "",
        },
        {
          time: "2018-05-08 21:36:04",
          ftime: "2018-05-08 21:36:04",
          context: "商品已经下单",
          location: "",
        },
      ],
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$axios("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      this.$message.success(res.meta.msg);
      // console.log(res.data);
      this.orderInfoList = res.data.goods;
      this.total = res.data.total;
    },
    // 页码改变调用函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    // 当前页数的改变引发的函数
    handleCurrentChange(curNum) {
      this.queryInfo.pagenum = curNum;
      this.getOrderList();
    },
    // 修改地址
    editAddress() {
      this.addAddressVisible = true;
    },
    // 提交表单
    confirmAddress() {
      this.addAddressVisible = false;
    },
    // 关闭表单的清空时间
    addressDialogVisibleClose() {
      this.$refs.addressFormRef.resetFields();
    },
    // 显示详细物流进度区
    showProgressInfo() {
      this.addAddressDetialsVisible = true;
    },
  },
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
