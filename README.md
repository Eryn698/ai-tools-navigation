# 🤖 AI工具导航网站

一个基于 Vue 3 + Vite + Tailwind CSS 的现代化AI工具导航网站

## ✨ 功能特性

- ✅ **响应式设计** - 完美适配手机、平板、PC
- ✅ **暗黑模式** - 一键切换亮色/暗色主题
- ✅ **实时搜索** - 快速搜索AI工具名称和描述
- ✅ **分类筛选** - 按类别快速筛选工具
- ✅ **卡片布局** - 美观的工具卡片展示
- ✅ **流畅动画** - 优雅的悬停和过渡效果

## 📦 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **Vite** - 极速开发构建工具
- **Tailwind CSS** - 实用优先的CSS框架
- **VueUse** - Vue组合式工具集

## 🚀 快速开始

### 安装依赖
```bash
cd ai-navigation
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 `http://localhost:3000` 查看效果

### 构建生产版本
```bash
npm run build
```

构建产物在 `dist/` 目录

### 预览生产版本
```bash
npm run preview
```

## 📝 添加/编辑AI工具

编辑 `src/App.vue` 中的 `tools` 数组：

```javascript
const tools = ref([
  {
    name: '工具名称',
    url: 'https://example.com',
    icon: '🤖',  // Emoji图标
    category: '分类名称',
    description: '工具描述文字'
  },
  // 添加更多工具...
])
```

## 🎨 自定义样式

- 修改 `src/style.css` 中的 Tailwind 组件类
- 修改 `tailwind.config.js` 自定义主题
- 修改 `src/App.vue` 中的模板和样式

## 🌐 部署到服务器

### 方式一：Docker部署（推荐）

1. 构建Docker镜像：
```bash
docker build -t ai-navigation .
```

2. 运行容器：
```bash
docker run -d -p 80:80 ai-navigation
```

### 方式二：Nginx部署

1. 构建项目：
```bash
npm run build
```

2. 将 `dist/` 目录上传到服务器

3. 配置Nginx：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 📁 项目结构

```
ai-navigation/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   ├── App.vue          # 主应用组件
│   ├── main.js          # 入口文件
│   └── style.css        # 全局样式
├── index.html           # HTML模板
├── package.json         # 依赖配置
├── vite.config.js       # Vite配置
├── tailwind.config.js   # Tailwind配置
└── postcss.config.js    # PostCSS配置
```

## 🔧 后续扩展建议

- [ ] 添加工具提交功能
- [ ] 集成访问统计（Google Analytics / 自建）
- [ ] 添加工具详情页
- [ ] 实现用户收藏功能
- [ ] 添加工具评分/评论
- [ ] 后台管理系统

## 📄 许可证

MIT License

---

Made with ❤️ by QClaw
