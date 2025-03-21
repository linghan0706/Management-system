<template>
  <div class="test-page">
    <a-card class="test-card" title="测试页面2">
      <p>这是测试页面2的内容，用于测试和演示。</p>
      <a-divider />
      <a-space direction="vertical" style="width: 100%">
        <a-alert type="success" title="成功提示">
          操作已成功完成。
        </a-alert>
        <a-alert type="warning" title="警告提示">
          请注意可能存在的风险。
        </a-alert>
        <a-alert type="error" title="错误提示">
          操作失败，请重试。
        </a-alert>
      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑代码
</script>

<style lang="scss" scoped>
.test-page {
  padding: 16px;
  
  .test-card {
    width: 100%;
  }
}
</style> 