<template>
    <el-card :body-style="{ padding: '20px' }">
      <h3>{{ data.title }}</h3>
      <p>{{ data.content }}</p>
    </el-card>
  </template>
  
  <script>
  export default {
    name: 'DataCard',
    props: {
      data: {
        type: Object,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  /* 可根据需要自定义样式 */
  </style>
  