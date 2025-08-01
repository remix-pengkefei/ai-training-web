#!/bin/bash

echo "🚀 AI培训活动系统部署脚本"
echo "========================="
echo ""

# 检查端口3000是否被占用
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口3000已被占用，正在尝试关闭..."
    kill -9 $(lsof -t -i:3000) 2>/dev/null || true
    sleep 1
fi

# 启动服务
echo "✅ 启动开发服务器..."
echo "📍 访问地址: http://localhost:3000"
echo ""
echo "服务器正在启动，请稍候..."
echo "如果浏览器没有自动打开，请手动访问上述地址"
echo ""

# 启动开发服务器
BROWSER=open npm start