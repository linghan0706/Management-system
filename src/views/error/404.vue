<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-image">
        <img src="@/assets/images/404.svg" alt="404" />
      </div>
      <h1 class="error-title">404</h1>
      <p class="error-desc">抱歉，您访问的页面不存在</p>
      <div class="error-actions">
        <a-space>
          <a-button type="primary" @click="goHome">
            <template #icon>
              <icon-home />
            </template>
            返回首页
          </a-button>
          <a-button @click="goBack">
            <template #icon>
              <icon-undo />
            </template>
            返回上一页
          </a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--bg-color);
  
  .error-content {
    text-align: center;
    padding: 40px;
    max-width: 500px;
    
    .error-image {
      margin-bottom: 24px;
      
      img {
        max-width: 100%;
        height: auto;
      }
    }
    
    .error-title {
      font-size: 72px;
      font-weight: 700;
      color: var(--primary-color);
      margin: 0 0 16px;
    }
    
    .error-desc {
      font-size: 18px;
      color: var(--text-regular);
      margin-bottom: 32px;
    }
    
    .error-actions {
      margin-top: 24px;
    }
  }
}

@media (max-width: 768px) {
  .error-container {
    .error-content {
      padding: 20px;
      
      .error-title {
        font-size: 48px;
      }
      
      .error-desc {
        font-size: 16px;
      }
    }
  }
}
</style>