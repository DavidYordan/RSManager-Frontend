<template>
    <span>{{ displayNumber }}</span>
  </template>
  
  <script>
  import { ref, watch, onMounted } from 'vue';
  
  export default {
    name: 'AnimatedNumber',
    props: {
      number: {
        type: Number,
        required: true,
      },
      duration: {
        type: Number,
        default: 1000, // 动画持续时间，单位毫秒
      },
    },
    setup(props) {
      const displayNumber = ref(0);
      let startTimestamp = null;
  
      const animate = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = timestamp - startTimestamp;
        const progressRatio = Math.min(progress / props.duration, 1);
        displayNumber.value = Math.floor(props.number * progressRatio);
        if (progress < props.duration) {
          window.requestAnimationFrame(animate);
        } else {
          displayNumber.value = props.number;
        }
      };
  
      watch(
        () => props.number,
        (newVal) => {
          startTimestamp = null;
          window.requestAnimationFrame(animate);
        },
        { immediate: true }
      );
  
      return {
        displayNumber,
      };
    },
  };
  </script>
  
  <style scoped>
  span {
    font-size: 2em;
    font-weight: bold;
    transition: all 0.5s ease;
  }
  </style>
  