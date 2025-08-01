#!/bin/bash

echo "启动AI培训系统 - 数据库版"
echo "================================"

# 检查端口是否被占用
check_port() {
    lsof -i :$1 > /dev/null 2>&1
    return $?
}

# 杀死占用端口的进程
kill_port() {
    local port=$1
    local pid=$(lsof -t -i :$port)
    if [ ! -z "$pid" ]; then
        echo "端口 $port 被占用，正在停止进程..."
        kill -9 $pid
        sleep 2
    fi
}

# 检查并清理端口
if check_port 3001; then
    kill_port 3001
fi

if check_port 3000; then
    kill_port 3000
fi

# 安装后端依赖
echo "正在安装后端依赖..."
cd backend
npm install

# 启动后端服务器
echo "启动后端服务器..."
nohup node server.js > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "后端服务器已启动 (PID: $BACKEND_PID)"

# 等待后端启动
sleep 3

# 返回主目录
cd ..

# 启动前端开发服务器
echo "启动前端开发服务器..."
npm start

# 当前端服务器关闭时，同时关闭后端
kill $BACKEND_PID 2>/dev/null
echo "系统已关闭"