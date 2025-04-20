#!/bin/bash

# Убиваем все существующие процессы node
pkill -f node || true

# Запускаем Next.js в фоновом режиме с перенаправлением вывода в лог-файл
nohup npm run next-dev > ./logs/next.log 2>&1 &

# Сохраняем PID процесса
echo $! > ./logs/next.pid

echo "Next.js сервер запущен в фоновом режиме (PID: $(cat ./logs/next.pid))"
echo "Логи доступны в ./logs/next.log" 