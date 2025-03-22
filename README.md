# Xhan Admin

这是一个现代化的后台管理系统，基于Vue 3和Vite构建。

## 项目设置

```sh
npm install
```

### 开发环境编译和热重载

```sh
npm run dev
```

### 生产环境类型检查、编译和压缩

```sh
npm run build
```

## Netlify部署指南

本项目已配置好Netlify部署所需的所有文件，包括：

1. `netlify.toml` - Netlify的主配置文件，指定了构建命令、发布目录和路由重定向规则
2. `public/_redirects` - 确保SPA路由在Netlify上正常工作的重定向规则

### 如何部署到Netlify

#### 方法一：通过Netlify网站部署

1. 在[Netlify官网](https://www.netlify.com/)注册并登录
2. 点击"New site from Git"按钮
3. 选择您的Git提供商(GitHub, GitLab, Bitbucket)
4. 授权Netlify访问您的仓库
5. 选择包含此项目的仓库
6. 构建设置已在`netlify.toml`中配置好，无需更改
7. 点击"Deploy site"按钮

#### 方法二：通过Netlify CLI部署

1. 安装Netlify CLI: `npm install -g netlify-cli`
2. 在项目根目录运行: `netlify login`
3. 初始化项目: `netlify init`
4. 按照提示完成配置
5. 部署网站: `netlify deploy --prod`

### 注意事项

1. 本项目使用Vue Router的history模式，已通过`netlify.toml`和`_redirects`文件配置好路由重定向
2. 如果您的API后端不是部署在Netlify上，请确保CORS设置正确
3. 如需自定义域名，可在Netlify控制面板中设置

### 环境变量

如果您的项目需要环境变量，可以在Netlify控制面板中的"Site settings" > "Build & deploy" > "Environment"中设置。

### 问题排查

如果部署后遇到问题：

1. 检查Netlify构建日志
2. 确认`netlify.toml`配置正确
3. 验证路由重定向是否生效
4. 检查API请求是否正确配置

## 推荐的IDE设置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (并禁用Vetur)。

## 自定义配置

参见 [Vite配置参考](https://vite.dev/config/)。
