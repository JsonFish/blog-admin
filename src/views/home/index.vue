<script lang="ts" setup>
import { ref, onMounted } from "vue";
//  按需引入 echarts
import * as echarts from "echarts";
const main = ref(); // 使用ref创建虚拟DOM引用，使用时用main.value
onMounted(() => {
  init();
});
function init() {
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(main.value);
  // 指定图表的配置项和数据
  const option = {
    backgroundColor: "#2c343c",

    title: {
      text: "Customized Pie",
      left: "center",
      top: 20,
      textStyle: {
        color: "#ccc"
      }
    },

    tooltip: {
      trigger: "item"
    },

    visualMap: {
      show: false,
      min: 80,
      max: 600,
      inRange: {
        colorLightness: [0, 1]
      }
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "55%",
        center: ["50%", "50%"],
        data: [
          { value: 335, name: "Direct" },
          { value: 310, name: "Email" },
          { value: 274, name: "Union Ads" },
          { value: 235, name: "Video Ads" },
          { value: 400, name: "Search Engine" }
        ].sort(function (a, b) {
          return a.value - b.value;
        }),
        roseType: "radius",
        label: {
          color: "rgba(255, 255, 255, 0.3)"
        },
        labelLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.3)"
          },
          smooth: 0.2,
          length: 10,
          length2: 20
        },
        itemStyle: {
          color: "#c23531",
          shadowBlur: 200,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        },

        animationType: "scale",
        animationEasing: "elasticOut",
        animationDelay: function () {
          return Math.random() * 200;
        }
      }
    ]
  };
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
}
</script>

<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <template #header> 首页 </template>
    <div ref="main" style="width: 200px; height: 200px" />
  </el-card>
</template>

<style scoped></style>
