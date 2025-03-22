// 这个文件作为koa和koa-router的引用点
// 确保Netlify构建时能正确解析这些依赖

import Koa from 'koa';
import Router from 'koa-router';

// 这个文件在前端项目中不会实际运行
// 仅用于确保构建过程中能正确解析koa和koa-router依赖

export default {
  Koa,
  Router
}; 