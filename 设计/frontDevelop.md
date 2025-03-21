### 前端开发详细需求文档

#### **一、技术栈规范**

| 类别     | 技术选型          | 版本要求         | 说明                            |
| -------- | ----------------- | ---------------- | ------------------------------- |
| 核心框架 | Vue3 + TypeScript | Vue3.3+          | 强制使用`<script setup>`语法    |
| 构建工具 | Vite              | Vite5.0+         | 集成`unplugin-auto-import`插件  |
| 状态管理 | Pinia             | Pinia2.1+        | 模块化设计，禁止全局Store       |
| UI组件库 | Element Plus      | Element Plus2.4+ | 按需引入，定制主题色（#1890ff） |
| 路由管理 | Vue Router        | Vue Router4.2+   | 动态路由加载，路由守卫配置      |
| 请求库   | Axios             | Axios1.6+        | 封装统一拦截器，支持Mock数据    |

#### **二、核心模块开发需求**

##### 1. **权限管理模块**

- 动态路由注入

  ```typescript
  TypeScript// 路由配置示例
  const asyncRoutes = [
    {
      path: '/user',
      component: Layout,
      meta: { roles: ['admin'] }, // 角色权限控制
      children: [
        { path: 'list', component: () => import('@/views/user/list.vue') }
      ]
    }
  ];
  
  // 权限过滤逻辑
  router.beforeEach((to, from, next) => {
    const hasPermission = store.user.roles.some(role => to.meta.roles.includes(role));
    hasPermission ? next() : next('/403');
  });
  ```

- 按钮级权限控制使用

  ```
  v-permission
  ```

  指令，实现粒度控制：
  
  ```vue
  Vue<template>
    <el-button v-permission="['user:delete']">删除用户</el-button>
  </template>
  ```

##### 2. **动态表格组件**

- **功能需求**

  - 支持列动态配置（显示/隐藏、排序、固定列）
  - 集成`xlsx`库实现Excel导出，导出时自动过滤无权限数据
  - 跨页选择（使用`@vueuse/core`的`useStorage`持久化选中状态）

- **代码规范**

  ```typescript
  Vue<script setup>
  // 列配置示例
  const columns = ref([
    { prop: 'name', label: '姓名', sortable: true },
    { prop: 'status', label: '状态', formatter: row => row.status ? '启用' : '停用' }
  ]);
  </script>
  ```

##### 3. **表单设计器**

- 技术实现

  - 基于`VueDraggable`实现拖拽布局
  - 生成JSON Schema并持久化至MongoDB

  ```json
  Json// 表单Schema示例
  {
    "fields": [
      { "type": "input", "label": "姓名", "rules": [{ "required": true }] },
      { "type": "select", "label": "角色", "options": ["admin", "user"] }
    ]
  }
  ```

##### 4. **监控看板**

- 集成方案

  - 使用`ECharts`渲染实时折线图/柱状图
  - 通过`WebSocket`接收后端性能数据流

  ```ts
  TypeScript// WebSocket连接示例
  const socket = new WebSocket('ws://monitor.xhansky.cn');
  socket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    updateChart(data);
  };
  ```

#### **三、开发规范**

##### 1. **目录结构**

```
Bashsrc/
├─api/          # 接口定义（按模块拆分）
├─assets/       # 静态资源（按类型分类）
├─components/   # 通用组件（命名用PascalCase）
├─router/       # 动态路由配置
├─store/        # Pinia模块（user.ts/auth.ts）
├─types/        # TypeScript类型定义
└─views/        # 页面级组件（禁止包含业务逻辑）
```

##### 2. **代码质量**

- ESLint规则

  ```json
  Json{
    "rules": {
      "vue/multi-word-component-names": "off", // 允许单文件名
      "no-console": "error",                   // 禁止提交console
      "@typescript-eslint/no-explicit-any": "error" // 禁用any类型
    }
  }
  ```

- Git提交规范遵循Angular Commit Message格式：

  ```
 feat(permission): 新增动态路由注入功能
  fix(table): 修复跨页选择数据丢失问题
```

##### 3. **接口请求规范**

- Axios封装示例

  ```ts
  TypeScript// api/request.ts
  const service = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000
  });
  
  // 请求拦截（添加Token）
  service.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${store.auth.token}`;
    return config;
  });
  
  // 响应拦截（统一错误处理）
  service.interceptors.response.use(
    response => response.data,
    error => {
      ElMessage.error(error.response?.data?.message || '请求失败');
      return Promise.reject(error);
    }
  );
  ```

#### **四、测试与部署**

##### 1. **自动化测试**

| 测试类型 | 工具                    | 覆盖率要求   | 测试场景示例                       |
| -------- | ----------------------- | ------------ | ---------------------------------- |
| 单元测试 | Vitest + Vue Test Utils | ≥85%         | 验证表格组件的列排序功能           |
| E2E测试  | Cypress                 | 100%核心流程 | 模拟用户登录-权限校验-数据操作流程 |
| 性能测试 | Lighthouse              | 评分≥90      | 首屏加载时间≤1.5s                  |

##### 2. **部署配置**

- Vite生产构建

  ```bash
  Bash# 构建命令
  npm run build -- --mode production
  
  # 输出产物
  dist/
  ├─assets/   # 哈希命名的静态资源
  └─index.html
  ```

- Nginx配置优化

  ```nginx
  Nginxserver {
    gzip on; # 启用Gzip压缩
    gzip_types text/plain application/json application/javascript;
    
    location / {
      try_files $uri $uri/ /index.html; # 支持History模式
    }
  }
  ```

#### **五、创新点实施**

1. **智能联调机制**

   ```bash
   TypeScript// .env.development
   VITE_API_URL=http://mock.eolink.com/project/12345
   ```

   - 开发阶段自动切换Mock接口，无需修改代码

2. **代码生成器集成**

   - 通过Freemarker模板生成标准化组件：

     ```vue
     Vue<!-- 生成代码示例 -->
     <template>
       <el-table :data="${entity}List">
         <el-table-column prop="name" label="名称" />
       </el-table>
     </template>
     ```