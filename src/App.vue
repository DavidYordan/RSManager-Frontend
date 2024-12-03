<!-- src/App.vue -->
<template>
  <div id="app">
    <!-- <Home /> -->
    <router-view />
  </div>
</template>

<script>
// import Home from './views/Home.vue';
export default {
  name: 'App',
  // components: {
  //   Home
  // }
};
</script>

<style>
/* 全局样式 */
body, html, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: auto;
  background: linear-gradient(135deg, #e0e0e0, #ffffff);
}
/* 引入'@/assets/css/global.css'; */


</style>
