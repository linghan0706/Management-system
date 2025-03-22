// 安装依赖的构建插件
module.exports = {
  onPreBuild: async ({ utils }) => {
    console.log('安装额外依赖...');
    try {
      await utils.run.command('npm install koa koa-router');
      console.log('依赖安装成功！');
    } catch (error) {
      console.error('依赖安装失败:', error);
      utils.build.failBuild('无法安装所需依赖');
    }
  }
}; 