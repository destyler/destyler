#!/bin/bash

# 用法：./killport.sh 端口号
PORT=$1

if [ -z "$PORT" ]; then
  echo "❌ 请输入端口号，例如：./killport.sh 3000"
  exit 1
fi

PID=$(lsof -ti tcp:$PORT)

if [ -z "$PID" ]; then
  echo "✅ 没有在端口 $PORT 上运行的进程"
  exit 0
fi

echo "⚠️ 正在杀掉运行在端口 $PORT 的进程 PID: $PID"
kill -9 $PID
echo "✅ 已杀掉进程"
