#!/bin/bash

echo "🚀 AI培训活动系统启动器"
echo "======================="
echo ""

# 进入项目目录
cd "$(dirname "$0")"

# 检查build目录是否存在
if [ ! -d "build" ]; then
    echo "📦 正在构建项目..."
    npm run build
fi

# 终止可能存在的服务
echo "🧹 清理旧进程..."
pkill -f "http.server" 2>/dev/null || true
pkill -f "serve" 2>/dev/null || true

# 启动服务
echo ""
echo "🌐 启动服务器..."
echo "📍 访问地址: http://localhost:5000"
echo ""

# 使用npx serve启动
npx serve -s build -l 5000