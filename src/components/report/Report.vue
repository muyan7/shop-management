<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <!-- 2.准备一个容器 -->
      <div id="main" style="width: 800px; height: 500px"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入
import * as echarts from "echarts";
export default {
  name: "Report",
  data() {
    return {
      //需要合并的数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },

  // 挂载才能渲染页面。页面上的元素，已经被渲染完毕。
  async mounted() {
    // 3.基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById("main"));
    // 4.指定图表的配置项和数据
    // 5.使用刚指定的配置项和数据显示图表。
    const { data: res } = await this.$axios("reports/type/1");
    if (res.meta.status !== 200) return this.$message.error("获取报表失败");
    // console.log(res.data);
    this.$message.success(res.meta.msg);
    const result = this._.merge(res.data, this.options);
    // console.log(result);
    myChart.setOption(result);
  },
};
</script>

<style lang="less" scoped></style>
