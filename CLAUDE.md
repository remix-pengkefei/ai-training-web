# AI Training Web - 版本记录

## 项目概述
这是一个为内部AI培训活动设计的移动端Web应用，采用React + TypeScript + Express.js + SQLite技术栈，提供活动展示、详情查看和在线报名功能。

**重要说明**: 这是数据库版本，使用SQLite存储数据，支持多用户数据共享。与之前的localStorage版本相比，所有UI保持不变，仅将数据存储方式改为数据库。

## 技术栈
- **前端**: React 18 + TypeScript + Tailwind CSS + React Router v6
- **后端**: Express.js + SQLite3 + CORS
- **构建工具**: Create React App + PostCSS
- **部署**: Python HTTP Server（生产构建）+ Node.js（开发环境）

## 项目结构
```
ai-training-web/
├── backend/                    # 后端服务器
│   ├── server.js              # Express服务器主文件
│   ├── ai_training.db         # SQLite数据库文件
│   └── package.json           # 后端依赖配置
├── build/                     # 生产构建输出
├── public/                    # 静态资源
│   ├── logo.png              # 应用Logo
│   └── index.html            # HTML模板
├── src/                       # 前端源代码
│   ├── components/           # React组件
│   │   └── RegistrationModal.tsx  # 报名弹窗组件
│   ├── pages/                # 页面组件
│   │   ├── HomePage.tsx      # 首页
│   │   └── EventDetailPage.tsx # 活动详情页
│   ├── services/             # API服务
│   │   └── api.ts           # API调用封装
│   ├── types/                # TypeScript类型定义
│   │   └── index.ts         # 类型定义文件
│   └── index.tsx            # 应用入口
├── start-fullstack.sh        # 全栈启动脚本
└── CLAUDE.md                 # 版本记录文档
```

## 核心功能

### 1. 首页 (HomePage.tsx)
- **Tinder风格卡片展示**: 全屏图片卡片，支持左右滑动切换
- **极简设计**: 仅显示图片和小巧的"查看详情"按钮
- **顶部Header**: Logo + "奇富先知 - 先进的人，先看到未来" + 副标题
- **分页指示器**: 底部点状指示当前卡片位置

### 2. 活动详情页 (EventDetailPage.tsx)
- **背景设计**: 使用首页相同的图片作为全屏背景，带半透明遮罩
- **毛玻璃卡片**: 两个透明毛玻璃效果的信息卡片
  - 活动信息卡片: 标题、简介、时间、地点、报名按钮
  - 活动调研卡片: 交互式问卷，带进度条和统计展示
- **白色文字**: 所有文字使用白色或半透明白色，确保在深色背景上的可读性

### 3. 报名弹窗 (RegistrationModal.tsx)
- **毛玻璃设计**: 与详情页风格统一的半透明背景
- **表单优化**: 
  - 输入框带图标装饰
  - 实时验证反馈
  - 渐变色按钮
  - 友好的提示信息

## 数据库设计

### events 表
```sql
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  startTime TEXT NOT NULL,
  location TEXT NOT NULL,
  signupDeadline TEXT NOT NULL,
  highlights TEXT,           -- JSON数组
  prizes TEXT,              -- JSON数组
  registeredCount INTEGER DEFAULT 0,
  description TEXT,
  -- 其他可选字段...
)
```

### registrations 表
```sql
CREATE TABLE registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  eventId TEXT NOT NULL,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  registeredAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (eventId) REFERENCES events(id),
  UNIQUE(eventId, name, department)  -- 防止重复报名
)
```

## API 接口

### 后端API (端口 3001)
- `GET /api/events` - 获取所有活动列表
- `GET /api/events/:id` - 获取单个活动详情
- `POST /api/events/:id/register` - 报名活动
  - Body: `{ name: string, department: string }`
  - Response: `{ success: boolean, registeredCount: number, message?: string }`

### 前端配置
- 使用 Create React App 的 proxy 配置避免 CORS 问题
- API调用使用相对路径 `/api/*`

## 设计特点

### UI/UX 设计
1. **移动优先**: 专为手机屏幕设计，触摸手势友好
2. **探探风格**: 全屏卡片式浏览，简洁直观
3. **毛玻璃美学**: 现代化的半透明效果，层次分明
4. **响应式交互**: 流畅的动画过渡，即时的用户反馈

### 技术特点
1. **数据持久化**: SQLite数据库存储，支持多用户共享
2. **防重复报名**: 数据库层面的唯一性约束
3. **实时同步**: 报名后立即更新显示的报名人数
4. **错误处理**: 完善的错误提示和用户引导

## 启动方式

### 开发环境（带数据库）
```bash
# 方式1: 使用启动脚本
./start-fullstack.sh

# 方式2: 分别启动
# 启动后端
cd backend && npm install && node server.js

# 启动前端（新终端）
npm start
```

### 生产部署
```bash
# 构建前端
npm run build

# 启动静态服务器
python3 -m http.server 8080 --directory build
```

## 版本历史

### v1.0 - 数据库版 (2024-08-01)
- ✅ 基于之前的UI版本，保持所有界面设计不变
- ✅ 从localStorage迁移到SQLite数据库存储
- ✅ 新增Express.js后端服务器
- ✅ 实现RESTful API接口
- ✅ 支持多用户数据共享
- ✅ 数据库级别的防重复报名机制
- ✅ 报名数据持久化存储

## 待优化事项
1. 添加更多活动信息字段（如议程、讲师等）
2. 实现用户认证系统
3. 添加报名成功邮件通知
4. 优化移动端手势体验
5. 添加活动搜索和筛选功能
6. 实现报名名单导出功能

## 开发备注
- 前端代理配置在 `package.json` 中的 `"proxy": "http://localhost:3001"`
- 数据库文件位于 `backend/ai_training.db`
- 所有图片使用Unsplash的占位图，实际部署时需要替换
- Logo文件需要放在 `public/logo.png`

## 重要注意事项 ⚠️

### 生产构建 vs 开发模式
1. **当前项目使用生产构建模式运行**：
   - 前端通过 `python3 -m http.server 8080 --directory build` 启动
   - 这种方式提供的是 `build/` 目录中的静态文件
   - **修改源代码（src/）后必须运行 `npm run build` 重新构建**

2. **常见错误**：
   - ❌ 修改了 `src/` 目录的代码但忘记重新构建
   - ❌ 以为修改会自动生效（只有开发模式 `npm start` 才会热重载）
   - ✅ 正确流程：修改代码 → `npm run build` → 刷新页面

### 后端自动数据插入
1. **后端服务器启动时的行为**：
   - 会检查数据库是否为空
   - 如果为空，会自动插入模拟数据
   - 要保持真正的空数据库，需要注释掉 `server.js` 中的自动插入代码

2. **清空数据的正确步骤**：
   ```bash
   # 1. 清空数据库
   sqlite3 ai_training.db "DELETE FROM registrations; DELETE FROM events;"
   
   # 2. 确保后端不会自动插入数据（检查 server.js）
   
   # 3. 重启后端服务器
   ```

### 调试建议
- 使用开发模式（`npm start`）进行开发，可以实时看到修改
- 使用生产模式部署时，记得每次修改后都要重新构建
- 清除浏览器缓存或使用强制刷新（Cmd+Shift+R）来确保加载最新版本

### 路由参数不匹配问题
1. **问题描述**：
   - 管理后台创建活动功能不工作，点击保存后没有任何反应
   - 数据库中没有新增记录，但也没有错误提示

2. **根本原因**：
   ```typescript
   // 路由配置
   <Route path="/events/new" element={<EventEditPage />} />
   <Route path="/events/:id/edit" element={<EventEditPage />} />
   
   // 组件中的错误代码
   const { id } = useParams<{ id: string }>();
   const isNew = id === 'new';  // 问题：路径 /events/new 没有 :id 参数
   ```
   
   - 路径 `/events/new` 没有定义 `:id` 参数
   - `useParams()` 返回 `{ id: undefined }`
   - `undefined === 'new'` 结果是 `false`
   - 导致创建活动的代码分支没有执行

3. **解决方案**：
   ```typescript
   const location = window.location.pathname;
   const isNew = location.includes('/events/new');
   ```
   - 直接检查URL路径来判断是否是创建新活动
   - 不依赖可能不存在的路由参数

4. **调试技巧**：
   - 添加详细的日志输出，追踪代码执行流程
   - 检查所有条件分支是否都有处理
   - 使用浏览器开发者工具的Console和Network标签
   - 静默失败的代码很难调试，要确保有适当的错误处理和日志

### 调研问题配置功能

1. **功能概述**：
   - 管理后台可以为每个活动配置调研问题
   - 支持多选题，每题可配置2-8个选项
   - 前端详情页会使用真实的调研问题替代硬编码的模拟问题

2. **实现细节**：
   ```sql
   -- 数据库字段
   ALTER TABLE events ADD COLUMN surveyQuestions TEXT; -- JSON格式存储
   ```
   
   ```typescript
   // 类型定义 
   export type SurveyQuestion = {
     id: number;
     question: string;
     options: string[];
     stats?: number[]; // 百分比统计
   };
   ```

3. **管理后台界面**：
   - 活动编辑页面新增"调研问题"模块
   - 支持添加/删除问题
   - 支持添加/删除选项（最少2个选项）
   - 实时预览问题格式

4. **前端展示逻辑**：
   - 优先使用活动的真实调研问题
   - 如果没有配置调研问题，回退到模拟问题
   - 统计数据使用随机生成（实际部署时可接入真实统计）

## v1.0 版本总结 (2025-08-02)

### 核心功能完成情况

#### 用户端功能
1. **首页** ✅
   - Tinder风格卡片式活动展示
   - 左右滑动切换活动
   - 头部显示：Logo + "奇富先知" + "先进的人，先看到未来"
   - 点击图片或按钮进入详情页

2. **活动详情页** ✅
   - 毛玻璃卡片设计
   - 活动信息展示（时间、地点、已报名人数）
   - 立即报名/查看回放按钮（根据活动时间自动切换）
   - 调研问题模块（支持答题和查看结果）

3. **报名功能** ✅
   - 毛玻璃风格报名弹窗
   - 姓名、部门信息收集
   - 防重复报名机制
   - 报名成功提示

#### 管理后台功能
1. **登录系统** ✅
   - 用户名：admin，密码：qifukeji
   - localStorage保存登录状态

2. **活动管理** ✅
   - 活动列表展示（状态标识：报名中/已结束/报名截止）
   - 创建活动（包含图片上传）
   - 编辑活动
   - 删除活动（带确认提示）
   - 查看报名列表

3. **调研问题配置** ✅
   - 动态添加/删除问题
   - 每题支持2-8个选项
   - 与活动数据一起保存

### 技术架构

#### 前端技术栈
- React 18 + TypeScript
- Tailwind CSS（响应式设计）
- React Router v6（SPA路由）
- 构建工具：Create React App
- 静态服务器：serve（支持SPA fallback）

#### 后端技术栈
- Node.js + Express.js
- SQLite数据库（轻量级、文件型）
- Multer（图片上传）
- CORS中间件

#### 部署架构
```
前端用户页面: http://localhost:8080 (serve)
管理后台: http://localhost:3002 (serve)
后端API: http://localhost:3001 (node)
```

### 关键经验教训

#### 1. 开发流程问题及解决方案

**问题：硬编码占位符未替换**
- 案例：回放链接使用了 `https://example.com/replay/` 硬编码
- 教训：占位符代码必须标记TODO
- 解决：建立代码审查清单，搜索所有硬编码URL

**问题：类型定义不同步**
- 案例：后端添加了replayUrl字段，前端TypeScript类型未更新
- 教训：前后端类型定义要保持同步
- 解决：修改数据结构时同步更新所有相关类型定义

**问题：生产环境与开发环境差异**
- 案例：Python http.server不支持SPA路由，导致404错误
- 教训：要考虑不同环境的差异
- 解决：使用serve替代，或配置环境感知的API URL

#### 2. 数据库相关问题

**问题：ALTER TABLE静默失败**
- 案例：surveyQuestions字段添加失败但没有报错
- 教训：数据库操作要有明确的错误处理
- 解决：手动检查并添加缺失字段

**问题：JSON字段解析遗漏**
- 案例：GET请求未解析surveyQuestions的JSON
- 教训：所有JSON字段都需要在API层解析
- 解决：在所有相关API端点添加JSON.parse

#### 3. UI/UX改进历程

**首页头部演进**
1. 初版：Logo + "奇富先知 - 先进的人，先看到未来" + 副标题
2. 中版：左右分离布局，绿色文字
3. 终版：Logo + "奇富先知" + "先进的人，先看到未来"作为副标题

**设计原则总结**
- 保持简洁，避免信息过载
- 颜色使用要谨慎，黑色文字通常更稳定
- 移动优先，所有交互都要考虑触屏体验

### 待优化事项

1. **性能优化**
   - 图片懒加载
   - API请求缓存
   - 构建产物优化

2. **用户体验**
   - 加载状态优化
   - 错误提示优化
   - 手势反馈增强

3. **功能扩展**
   - 活动分类/标签
   - 搜索功能
   - 数据导出
   - 批量操作

4. **安全加固**
   - 管理后台JWT认证
   - API限流
   - 输入验证增强
   - XSS防护

### 部署建议

1. **生产环境配置**
   ```bash
   # 使用环境变量配置API地址
   REACT_APP_API_URL=https://api.example.com
   
   # 使用nginx反向代理
   location /api {
     proxy_pass http://backend:3001;
   }
   ```

2. **数据库备份**
   ```bash
   # 定期备份SQLite文件
   cp ai_training.db backups/ai_training_$(date +%Y%m%d).db
   ```

3. **监控建议**
   - API响应时间监控
   - 错误日志收集
   - 用户行为分析

## 联系方式
如有问题或建议，请通过内部沟通渠道联系开发团队。

---

## v2.0 - 线上部署版 (2025-08-02)

### 部署概述
成功将项目部署到阿里云ECS服务器，实现了公网访问。

- **服务器**: 阿里云ECS（Ubuntu 22.04）
- **公网IP**: 101.200.29.196
- **访问地址**:
  - 前端: http://101.200.29.196/
  - 管理后台: http://101.200.29.196/admin

### 部署过程中的关键问题与解决

#### 1. GitHub访问问题
**问题**: 中国大陆服务器无法直接访问GitHub
```bash
# 尝试的解决方案
1. 各种Git代理配置 - 失败
2. GitHub镜像站 - 失败
3. Cloudflare WARP - 部分成功
```

**最终解决方案**:
```bash
# 安装Cloudflare WARP
sudo apt install cloudflare-warp
warp-cli register
warp-cli mode proxy
warp-cli connect

# 通过proxychains4下载
proxychains4 wget --no-check-certificate https://codeload.github.com/xxx/zip/refs/heads/master -O web.zip
```

#### 2. 阿里云安全组配置
**问题**: 外网无法访问，显示ERR_CONNECTION_RESET
**原因**: 阿里云默认不开放80端口
**解决**: 在阿里云控制台添加安全组规则
- 端口：80/80
- 协议：TCP
- 授权对象：0.0.0.0/0

#### 3. 管理后台路由问题
**问题**: /admin路径访问显示空白
**解决**: 在package.json中添加homepage配置
```json
{
  "homepage": "/admin",
  ...
}
```

#### 4. SPA路由支持
**问题**: Python http.server不支持SPA fallback
**解决**: 使用serve替代
```bash
serve -s build -l 8080
```

### 部署架构

```
Internet
    ↓
阿里云ECS (101.200.29.196)
    ├── Nginx (80端口)
    │   ├── / → 前端静态文件
    │   ├── /admin → 管理后台静态文件
    │   └── /api → 反向代理到3001
    ├── PM2
    │   └── Node.js后端 (3001端口)
    └── SQLite数据库
```

### Nginx配置
```nginx
server {
    listen 80;
    server_name _;

    location / {
        root /var/www/ai-training/ai-training-web/build;
        try_files $uri /index.html;
    }

    location /admin {
        alias /var/www/ai-training/ai-training-admin/build;
        try_files $uri /admin/index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
    }

    location /uploads {
        alias /var/www/ai-training/ai-training-web/backend/uploads;
    }
}
```

### 自动化部署准备

已准备GitHub Actions配置文件，后续可实现：
- 代码推送自动部署
- 版本回滚
- 部署日志记录

### 性能优化建议

1. **当前状态**:
   - 前端构建大小: ~80KB（优秀）
   - 无CDN加速
   - 无HTTPS

2. **后续优化**:
   - 配置Let's Encrypt免费SSL证书
   - 使用阿里云CDN加速静态资源
   - 升级到MySQL数据库
   - 添加Redis缓存层

### 运维相关

#### 常用命令
```bash
# 查看服务状态
pm2 status
sudo systemctl status nginx

# 查看日志
pm2 logs ai-training-backend
sudo tail -f /var/log/nginx/error.log

# 重启服务
pm2 restart ai-training-backend
sudo systemctl restart nginx
```

#### 备份策略
```bash
# 数据库备份
cp /var/www/ai-training/ai-training-web/backend/ai_training.db ~/backups/ai_training_$(date +%Y%m%d).db

# 代码备份（已推送GitHub）
```

### 已知问题

1. **模拟数据问题**: 前端可能包含硬编码的模拟数据
2. **HTTP安全警告**: 浏览器提示"不安全"
3. **移动端适配**: 部分UI细节需要优化

### 下一步计划

1. [ ] 配置HTTPS证书
2. [ ] 清理前端模拟数据
3. [ ] 实施自动化部署
4. [ ] 添加监控告警
5. [ ] 数据库升级到MySQL
6. [ ] 接入企业微信/钉钉

---
*最后更新: 2025-08-02*
*版本: v2.0 - 线上部署版*
*说明: 完成线上部署，项目已可公网访问，为后续迭代奠定基础*