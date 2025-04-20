#!/bin/bash

if [ -f ./logs/next.pid ]; then
    PID=$(cat ./logs/next.pid)
    if ps -p $PID > /dev/null; then
        kill $PID
        echo "Next.js сервер остановлен (PID: $PID)"
    else
        echo "Процесс с PID $PID не найден"
    fi
    rm ./logs/next.pid
else
    echo "PID файл не найден"
    pkill -f node || true
fi 