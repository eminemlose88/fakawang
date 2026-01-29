看起来您的 `epusdt` 可执行文件丢失了，或者没有生成在当前目录下。

由于您之前成功重启了服务 (`systemctl restart`)，这说明服务运行的二进制文件可能在别的地方，或者之前的编译没有成功生成到当前目录。

为了解决这个问题，我建议您**重新编译**一下，然后添加钱包。请依次执行以下命令：

## 1. 重新编译 Epusdt

```bash
cd /home/ec2-user/epusdt/epusdt-0.0.3/src
go mod tidy
go build -o ../epusdt main.go
cd ..
```

*(这一步会重新生成* *`epusdt`* *文件到* *`epusdt-0.0.3`* *目录)*

## 2. 再次尝试添加钱包

```bash
./epusdt wallet add --token=TJpuLCJhhVbQWP2vLihtFdxUJ11MvY9Ag1
```

## 3. 重启服务以确保生效

```bash
sudo systemctl restart epusdt
```

请按顺序执行这些命令，应该就能解决问题了。
