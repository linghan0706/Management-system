<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { login } from '../../api/user'

const router = useRouter()

// 表单数据
const loginForm = reactive({
  username: 'admin',
  password: '123456',
  rememberMe: false
})

// 表单校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { minLength: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
}

// 表单引用
const loginFormRef = ref()

// 加载状态
const loading = ref(false)

// 提交表单
const handleSubmit = async () => {
  console.log('开始登录处理')
  try {
    await loginFormRef.value.validate()
    console.log('表单验证通过')
    
    loading.value = true
    console.log('尝试登录:', loginForm)
    
    try {
      // 调用登录接口
      const response = await login(loginForm)
      console.log('登录成功:', response)
      
      // 存储token和用户信息
      localStorage.setItem('token', response.token)
      localStorage.setItem('userInfo', JSON.stringify(response.userInfo))
      
      Message.success('登录成功')
      console.log('准备跳转到首页')
      
      // 使用window.location直接跳转，绕过路由
      window.location.href = '/'
    } catch (error: any) {
      console.error('登录API错误:', error)
      Message.error(error.message || '登录失败，请检查用户名和密码')
    } finally {
      loading.value = false
    }
  } catch (error) {
    console.error('表单验证失败', error)
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo">
          <img src="../../assets/images/logo.svg" alt="logo" class="logo-img" />
          <h1 class="logo-text">XHan Admin</h1>
        </div>
        <div class="welcome-text">欢迎回来，请登录</div>
      </div>
      
      <a-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        class="login-form"
      >
        <a-form-item field="username" hide-label>
          <a-input
            v-model="loginForm.username"
            placeholder="用户名"
            size="large"
          >
            <template #prefix>
              <icon-user />
            </template>
          </a-input>
        </a-form-item>
        
        <a-form-item field="password" hide-label>
          <a-input-password
            v-model="loginForm.password"
            placeholder="密码"
            size="large"
            allow-clear
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>
        
        <div class="login-options">
          <a-checkbox v-model="loginForm.rememberMe">记住我</a-checkbox>
          <a-link>忘记密码?</a-link>
        </div>
        
        <a-button
          type="primary"
          long
          size="large"
          :loading="loading"
          @click="handleSubmit"
        >
          登录
        </a-button>
      </a-form>
      
      <div class="login-actions">
        <a-divider orientation="center">
          <span class="login-actions-text">其他登录方式</span>
        </a-divider>
        <div class="social-login">
          <a-space size="large">
            <a-button shape="circle" type="text">
              <icon-github />
            </a-button>
            <a-button shape="circle" type="text">
              <icon-wechat />
            </a-button>
            <a-button shape="circle" type="text">
              <icon-qq />
            </a-button>
          </a-space>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  
  .login-card {
    width: 420px;
    padding: 40px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    
    .login-header {
      margin-bottom: 40px;
      text-align: center;
      
      .logo {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 24px;
        
        .logo-img {
          width: 40px;
          height: 40px;
          margin-right: 12px;
        }
        
        .logo-text {
          font-size: 24px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }
      }
      
      .welcome-text {
        font-size: 16px;
        color: var(--text-secondary);
      }
    }
    
    .login-form {
      margin-bottom: 24px;
      
      .login-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }
    }
    
    .login-actions {
      .login-actions-text {
        font-size: 12px;
        color: var(--text-secondary);
      }
      
      .social-login {
        display: flex;
        justify-content: center;
        margin-top: 16px;
        
        :deep(.arco-btn) {
          font-size: 24px;
          transition: transform 0.3s;
          
          &:hover {
            transform: scale(1.2);
            color: var(--primary-color);
          }
        }
      }
    }
  }
}

// 响应式调整
@media (max-width: 480px) {
  .login-container {
    .login-card {
      width: 90%;
      padding: 24px;
    }
  }
}
</style> 