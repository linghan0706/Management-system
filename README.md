# Lin Admin

现代化的后台管理系统

## 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## Netlify部署

1. 将代码推送到GitHub仓库
2. 在Netlify中连接GitHub仓库
3. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
4. 环境变量设置：
   - NODE_VERSION: 18
   - NPM_VERSION: 9

## 注意事项

- 确保`netlify.toml`文件存在并配置正确
- 检查`vite.config.js`中的base配置
- 确保所有环境变量都已正确设置

## 技术栈

- Vue 3
- TypeScript
- Vite
- Arco Design Vue
- Vue Router
- Pinia

## 项目设置

```sh
npm install
```

### 开发环境编译和热重载

```