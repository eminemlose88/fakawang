#!/bin/bash
set -e

echo ">>> Updating System..."
sudo dnf update -y

echo ">>> Installing Go..."
sudo dnf install -y golang

echo ">>> Installing MySQL Client (MariaDB)..."
# Amazon Linux 2023 uses mariadb105
sudo dnf install -y mariadb105 || sudo dnf install -y mysql

echo ">>> Installing Redis..."
sudo dnf install -y redis6 || sudo dnf install -y redis

echo ">>> Starting Redis..."
sudo systemctl enable redis6 --now || sudo systemctl enable redis --now

echo ">>> Building Epusdt..."
# Ensure we are in the right directory
cd /home/ec2-user/epusdt/epusdt-0.0.3/src
go mod tidy
go build -o ../epusdt main.go

echo ">>> Build Complete! Binary is at /home/ec2-user/epusdt/epusdt-0.0.3/epusdt"
