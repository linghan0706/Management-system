<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'

// 系统设置表单
const systemForm = reactive({
  siteName: 'Lin Admin系统',
  logo: '@/assets/images/logo.svg',
  copyright: '© 2025 Lin Admin. All Rights Reserved.',
  recordNumber: '粤ICP备12345678号',
  allowRegister: true,
  registerReview: false,
  mailServer: 'smtp.example.com',
  mailPort: 465,
  mailUsername: 'admin@example.com',
  mailPassword: '******',
  mailFrom: 'admin@example.com',
  uploadLimit: 10,
  allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'docx', 'xlsx'],
  enableCache: true,
  cacheTime: 60,
  loginAttempts: 5,
  lockTime: 30
})

// 表单规则
const rules = {
  siteName: [{ required: true, message: '请输入站点名称' }],
  logo: [{ required: true, message: '请输入Logo路径' }],
  copyright: [{ required: true, message: '请输入版权信息' }],
  mailServer: [{ required: true, message: '请输入邮件服务器' }],
  mailPort: [{ required: true, message: '请输入邮件端口' }],
  mailUsername: [{ required: true, message: '请输入邮件账号' }],
  mailPassword: [{ required: true, message: '请输入邮件密码' }],
  mailFrom: [{ required: true, message: '请输入发件人地址' }],
  uploadLimit: [{ required: true, message: '请输入上传限制' }],
  loginAttempts: [{ required: true, message: '请输入登录尝试次数' }],
  lockTime: [{ required: true, message: '请输入锁定时间' }]
}

// 保存按钮加载状态
const saveLoading = ref(false)
const settingFormRef = ref()
const systemFormRef = ref()
const securityFormRef = ref()
const fileFormRef = ref()

// 发送测试邮件加载状态
const testMailLoading = ref(false)

// 保存系统设置
const saveSystemSettings = async (formRef: any) => {
  try {
    await formRef.value.validate()
    saveLoading.value = true
    
    // 模拟API请求
    setTimeout(() => {
      Message.success('系统设置保存成功')
      saveLoading.value = false
    }, 1000)
  } catch (error) {
    console.error('表单验证失败', error)
  }
}

// 发送测试邮件
const sendTestMail = () => {
  testMailLoading.value = true
  
  // 模拟发送请求
  setTimeout(() => {
    Message.success('测试邮件发送成功')
    testMailLoading.value = false
  }, 1500)
}

// 清除缓存
const clearCache = () => {
  Message.info('正在清除缓存...')
  
  // 模拟清除缓存
  setTimeout(() => {
    Message.success('缓存清除成功')
  }, 1000)
}

// 重置系统设置
const resetSystem = () => {
  Modal.warning({
    title: '确认重置',
    content: '确定要重置系统设置吗？这将恢复默认配置。',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      // 模拟重置操作
      setTimeout(() => {
        Message.success('系统设置已重置')
      }, 800)
    }
  })
}
</script>

<template>
  <div class="system-container">
    <a-card class="general-card">
      <template #title>
        系统设置
      </template>
      <template #extra>
        <a-space>
          <a-dropdown trigger="click">
            <a-button shape="circle" type="text">
              <template #icon><icon-more-vertical /></template>
            </a-button>
            <template #content>
              <a-doption @click="resetSystem">
                <a-space>
                  <icon-refresh />
                  <span>重置默认</span>
                </a-space>
              </a-doption>
              <a-doption @click="clearCache">
                <a-space>
                  <icon-delete />
                  <span>清除缓存</span>
                </a-space>
              </a-doption>
            </template>
          </a-dropdown>
          <a-avatar style="background-color: var(--color-fill-2)">
            <template #icon><icon-settings /></template>
          </a-avatar>
        </a-space>
      </template>
      <a-tabs default-active-key="1">
        <!-- 基本设置 -->
        <a-tab-pane key="1" title="基本设置">
          <a-form 
            ref="settingFormRef"
            :model="systemForm" 
            layout="vertical"
            :rules="rules"
            auto-label-width
          >
            <a-form-item field="siteName" label="站点名称">
              <a-input v-model="systemForm.siteName" placeholder="请输入站点名称" />
            </a-form-item>
            
            <a-form-item field="logo" label="站点Logo">
              <a-input v-model="systemForm.logo" placeholder="请输入Logo路径" />
              <div class="preview-area">
                <img :src="systemForm.logo" alt="Logo预览" class="logo-preview" />
              </div>
            </a-form-item>
            
            <a-form-item field="copyright" label="版权信息">
              <a-input v-model="systemForm.copyright" placeholder="请输入版权信息" />
            </a-form-item>
            
            <a-form-item field="recordNumber" label="备案号">
              <a-input v-model="systemForm.recordNumber" placeholder="请输入备案号" />
            </a-form-item>
            
            <a-form-item field="allowRegister" label="开放注册">
              <a-switch v-model="systemForm.allowRegister" />
            </a-form-item>
            
            <a-form-item field="registerReview" label="注册审核">
              <a-switch v-model="systemForm.registerReview" />
              <div class="form-item-help">开启后，新用户注册需要管理员审核</div>
            </a-form-item>
            
            <div class="form-actions">
              <a-button type="primary" :loading="saveLoading" @click="saveSystemSettings(settingFormRef)">
                保存设置
              </a-button>
            </div>
          </a-form>
        </a-tab-pane>
        
        <!-- 邮件设置 -->
        <a-tab-pane key="2" title="邮件设置">
          <a-form 
            ref="systemFormRef" 
            :model="systemForm" 
            layout="vertical"
            :rules="rules"
            auto-label-width
          >
            <a-row :gutter="[16, 16]">
              <a-col :xs="24" :sm="12">
                <a-form-item field="mailServer" label="SMTP服务器">
                  <a-input v-model="systemForm.mailServer" placeholder="请输入SMTP服务器" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12">
                <a-form-item field="mailPort" label="SMTP端口">
                  <a-input-number v-model="systemForm.mailPort" placeholder="请输入SMTP端口" style="width: 100%" />
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-row :gutter="[16, 16]">
              <a-col :xs="24" :sm="12">
                <a-form-item field="mailUsername" label="SMTP用户名">
                  <a-input v-model="systemForm.mailUsername" placeholder="请输入SMTP用户名" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12">
                <a-form-item field="mailPassword" label="SMTP密码">
                  <a-input-password v-model="systemForm.mailPassword" placeholder="请输入SMTP密码" />
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-form-item field="mailFrom" label="发件人邮箱">
              <a-input v-model="systemForm.mailFrom" placeholder="请输入发件人邮箱" />
            </a-form-item>
            
            <div class="form-actions">
              <a-space direction="horizontal" wrap size="medium">
                <a-button type="primary" :loading="saveLoading" @click="saveSystemSettings(systemFormRef)">
                  保存设置
                </a-button>
                <a-button status="success" :loading="testMailLoading" @click="sendTestMail">
                  发送测试邮件
                </a-button>
              </a-space>
            </div>
          </a-form>
        </a-tab-pane>
        
        <!-- 文件上传 -->
        <a-tab-pane key="3" title="文件上传">
          <a-form 
            ref="fileFormRef" 
            :model="systemForm" 
            layout="vertical"
            :rules="rules"
            auto-label-width
          >
            <a-form-item field="uploadLimit" label="单文件上传限制(MB)">
              <a-input-number v-model="systemForm.uploadLimit" min="1" max="100" style="width: 100%" />
            </a-form-item>
            
            <a-form-item field="allowedFileTypes" label="允许上传的文件类型">
              <a-select
                v-model="systemForm.allowedFileTypes"
                placeholder="请选择允许上传的文件类型"
                allow-clear
                allow-search
                multiple
              >
                <a-option value="jpg">jpg</a-option>
                <a-option value="jpeg">jpeg</a-option>
                <a-option value="png">png</a-option>
                <a-option value="gif">gif</a-option>
                <a-option value="pdf">pdf</a-option>
                <a-option value="docx">docx</a-option>
                <a-option value="xlsx">xlsx</a-option>
                <a-option value="zip">zip</a-option>
                <a-option value="rar">rar</a-option>
              </a-select>
              <div class="form-item-help">允许用户上传的文件类型列表</div>
            </a-form-item>
            
            <div class="form-actions">
              <a-button type="primary" :loading="saveLoading" @click="saveSystemSettings(fileFormRef)">
                保存设置
              </a-button>
            </div>
          </a-form>
        </a-tab-pane>
        
        <!-- 安全设置 -->
        <a-tab-pane key="4" title="安全设置">
          <a-form 
            ref="securityFormRef" 
            :model="systemForm" 
            layout="vertical"
            :rules="rules"
            auto-label-width
          >
            <a-row :gutter="[16, 16]">
              <a-col :xs="24" :sm="12">
                <a-form-item field="loginAttempts" label="登录尝试次数">
                  <a-input-number v-model="systemForm.loginAttempts" min="1" max="10" style="width: 100%" />
                  <div class="form-item-help">用户连续登录失败的最大次数，超过将锁定账户</div>
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12">
                <a-form-item field="lockTime" label="账户锁定时间(分钟)">
                  <a-input-number v-model="systemForm.lockTime" min="5" max="1440" style="width: 100%" />
                  <div class="form-item-help">账户锁定后需要等待的时间</div>
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-row :gutter="[16, 16]">
              <a-col :xs="24" :sm="12">
                <a-form-item field="enableCache" label="启用缓存">
                  <a-switch v-model="systemForm.enableCache" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12">
                <a-form-item field="cacheTime" label="缓存时间(分钟)">
                  <a-input-number v-model="systemForm.cacheTime" min="1" max="1440" style="width: 100%" />
                </a-form-item>
              </a-col>
            </a-row>
            
            <div class="form-actions">
              <a-space direction="horizontal" wrap size="medium">
                <a-button type="primary" :loading="saveLoading" @click="saveSystemSettings(securityFormRef)">
                  保存设置
                </a-button>
                <a-button status="warning" @click="clearCache">
                  <template #icon><icon-delete /></template>
                  清除缓存
                </a-button>
              </a-space>
            </div>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<style lang="scss" scoped>
.system-container {
  padding: 16px;
  
  .general-card {
    margin-bottom: 16px;
  }
  
  .form-actions {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid var(--color-neutral-3);
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .form-item-help {
    font-size: 12px;
    color: var(--color-text-3);
    margin-top: 4px;
  }
  
  .preview-area {
    margin-top: 8px;
    
    .logo-preview {
      max-width: 200px;
      max-height: 60px;
      padding: 8px;
      border: 1px dashed var(--color-neutral-3);
      border-radius: 4px;
    }
  }
}

@media (max-width: 768px) {
  .system-container {
    padding: 12px;
    
    :deep(.arco-form) {
      .arco-form-item {
        margin-bottom: 20px;
      }
    }
    
    :deep(.arco-tabs-nav) {
      overflow-x: auto;
      
      &::-webkit-scrollbar {
        display: none;
      }
    }
    
    .form-actions {
      margin-top: 20px;
      padding-top: 20px;
    }
    
    .preview-area {
      .logo-preview {
        max-width: 160px;
      }
    }
  }
}

@media (max-width: 576px) {
  .system-container {
    padding: 8px;
    
    :deep(.arco-card-header) {
      padding: 16px 12px;
    }
    
    :deep(.arco-card-body) {
      padding: 16px 12px;
    }
    
    :deep(.arco-tabs-content) {
      padding: 12px 0;
    }
    
    .form-actions {
      flex-direction: column;
      align-items: stretch;
      
      .arco-btn {
        width: 100%;
      }
    }
  }
}
</style> 