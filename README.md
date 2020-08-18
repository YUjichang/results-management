# vue-results-management

> 这是一个基于vue-admin-template二次开发的成绩管理系统，在vue-admin-template基础上添加了tagview和添加了路由组件。


## 相关项目
- [vue-admin-template](http://panjiachen.github.io/vue-admin-template)

- [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)

## Build Setup

```bash
# 克隆项目
git clone https://github.com/Yujichang/vue-results-management.git

# 进入项目目录
cd vue-results-management

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:9528/result](http://localhost:9528/result)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

更多信息请参考 [使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/)

## License

[MIT](https://github.com/Yujichang/results-management/blob/master/LICENSE) license.

Copyright (c) 2020 Yujichang