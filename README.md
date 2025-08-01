# 奇富先知 - AI先进工作方式分享平台

一个为内部AI培训活动设计的移动端Web应用，采用Tinder风格的卡片式浏览体验。

## 🚀 功能特点

- **移动端优先设计** - 专为手机端优化的触摸交互体验
- **Tinder风格浏览** - 左右滑动切换活动，简洁直观
- **活动报名系统** - 支持在线报名，防重复机制
- **调研问题模块** - 可配置的活动调研问题
- **管理后台** - 完整的活动CRUD操作
- **毛玻璃设计** - 现代化的视觉风格

## 🛠 技术栈

### 前端
- React 18 + TypeScript
- Tailwind CSS
- React Router v6

### 后端
- Express.js
- SQLite数据库
- Multer (文件上传)

## 📦 安装部署

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装步骤

1. 克隆项目
```bash
git clone [repository-url]
cd ai-training-web
```

2. 安装依赖
```bash
# 前端依赖
npm install

# 后端依赖
cd backend
npm install
cd ..
```

3. 启动服务

开发环境：
```bash
# 启动后端
cd backend
node server.js

# 启动前端（新终端）
npm start
```

生产环境：
```bash
# 构建前端
npm run build

# 使用 serve 启动（推荐）
serve -s build -l 8080
```

## 🔗 访问地址

- 前端用户页面: http://localhost:8080
- 后端API: http://localhost:3001
- 管理后台: 需要单独部署 ai-training-admin 项目

## 👤 管理后台

管理后台是独立的项目，位于 `ai-training-admin` 目录。

默认登录信息：
- 用户名: admin
- 密码: qifukeji

## 📄 许可证

内部使用

## 🤝 贡献

如有问题或建议，请通过内部沟通渠道联系开发团队。

---

更多技术细节请查看 [CLAUDE.md](./CLAUDE.md)
