<template>
    <el-dialog
      title="登录"
      :visible.sync="visible"
      width="400px"
      :before-close="handleClose"
      center
    >
      <el-form :model="loginForm" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    name: 'LoginModal',
    props: {
      visible: {
        type: Boolean,
        default: true
      }
    },
    emits: ['close', 'login-success'],
    setup(props, { emit }) {
      const loginForm = ref({
        username: '',
        password: ''
      });
  
      const rules = {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      };
  
      const formRef = ref(null);
  
      const handleClose = () => {
        emit('close');
      };
  
      const handleLogin = () => {
        formRef.value.validate((valid) => {
          if (valid) {
            // 发送登录请求
            // 假设后端接口为 /api/login，返回 { type: 'advanced' } 或 { type: 'normal' }
            axios.post('/api/login', loginForm.value)
              .then(response => {
                const authInfo = response.data;
                emit('login-success', authInfo);
              })
              .catch(error => {
                // 处理登录错误
                console.error(error);
                // 可以使用Element Plus的消息提示
                this.$message.error('登录失败，请检查账号密码');
              });
          }
        });
      };
  
      return {
        loginForm,
        rules,
        formRef,
        handleClose,
        handleLogin
      };
    }
  };
  </script>
  
  <style scoped>
  /* 可根据需要自定义样式 */
  </style>
  