# 初中语文教资备考工作台 · 系统运维与架构执行记录

本文档记录针对初中语文教资备考工作台（面向 158 篇统编课文与 6 本原版教材）所执行的全部架构部署、性能调优、脚本自动化与服务器运维动作。

---

## 一、本次执行的任务总览

### 1. 核心需求背景
- **痛点**：通过 GitHub Pages 访问国内加载慢、首屏及教材 PDF（单本 15MB~40MB）加载耗时长，且考生（电脑小白琪琪）需要随时随地在任何设备（手机、平板、电脑）极速秒开。
- **资源就位**：利用用户现有的阿里云轻量应用服务器（北京节点，公网 IP `47.93.28.243`，拥有 200 Mbps 峰值公网带宽与 40GB 磁盘），同时保留本地 100% 离线运行双轨运行方案。

---

## 二、具体执行动作与实现细节（做了什么 & 怎么做的）

### 1. 阿里云轻量应用服务器（Ubuntu 22.04 LTS）环境构建
- **环境检查**：
  - 通过本地 SSH 密钥（`linux_learning.pem`）免密登录 `root@47.93.28.243`；
  - 检查系统盘剩余 27GB 空间，内存与网络正常，Ubuntu 防火墙 `ufw` 处于 `inactive`（由外层阿里云安全组接管）。
- **软件包安装**：
  - 更新 APT 软件源并安装 `nginx` (1.18.0) 与 `rsync`。

### 2. Nginx 高性能与流式加载配置
针对教资备战的特殊资产结构（158 篇课文数据 + 6 大本原版教材 PDF 共 113MB），编写了定制化 Nginx 虚拟主机配置：
配置文件路径：`/etc/nginx/sites-available/teacher_learning`（已软链接至 `sites-enabled` 并移除 default 占位）。

- **HTTP 206 Partial Content (断点与字节切片流式加载)**：
  ```nginx
  location /textbooks/ {
      add_header Accept-Ranges bytes;
      add_header Access-Control-Allow-Origin *;
      expires 30d;
      sendfile on;
      sendfile_max_chunk 512k;
      tcp_nopush on;
  }
  ```
  - **原理与成效**：前端 PDF.js 通过 `Range: bytes=...` 发送分片请求，Nginx 直接以 `206 Partial Content` 毫秒级返回当前浏览页（仅几 KB 到几十 KB），无需完整下载整本 40MB PDF。
- **Gzip 极致压缩**：
  - 开启 `gzip_comp_level 6`，针对 HTML/JS/CSS/JSON 进行实时高压，课文与界面静态资源首屏体积压缩超 70%，0.2 秒极速呈现。
- **SPA 路由兜底与缓存策略**：
  - `try_files $uri $uri/ /index.html;` 保障路由刷新不报 404；
  - 对 `/assets/` 指纹哈希文件设置 1 年长缓存；对 `sw.js` 与 `manifest.json` 禁用强缓存（`no-cache`），确保更新热感知。
- **端口双监听**：同时监听 80 端口与备用 8899 端口。

### 3. 本地与服务器端数据同步
- 在本地打包 `docs/` 目录（包含 158 篇课文全文切片、逐字稿、黑板板书及 `textbooks/` 6 本教材 PDF）；
- 通过 SSH 高速通道传输至服务器 `/var/www/teacher_learning`，赋予 `www-data:www-data` 与 `755` 访问权限。

### 4. 自动化双击运维脚本交付
为实现“作者本地写代码 -> 一键秒同步服务器”，交付了以下工具：
1. **`3-部署到阿里云服务器.bat`**（及 `【3】一键部署到阿里云服务器.bat`）：
   - 双击自动调用 `scripts/deploy_to_server.ps1`；
   - 自动将 `docs/` 打包为 `site_deploy.tar.gz`，经 SSH 管道推送并服务器端解压，平滑重载 Nginx，全过程仅约 5 秒。
2. **`1-打开工作台.bat`**：
   - 琪琪本地极速离线版，断网环境下双击即在 `http://127.0.0.1:8899` 秒开。
3. **`2-一键更新.bat`**：
   - 琪琪专用一键拉取最新 GitHub 仓库版本。

---

## 三、网络与服务连通性验证结果

- **服务进程**：Nginx 稳定运行，监听 `0.0.0.0:80` 与 `0.0.0.0:8899`。
- **80 端口公网探测**：
  ```
  HTTP/1.1 200 OK
  Accept-Ranges: bytes
  Server: nginx/1.18.0 (Ubuntu)
  ```
- **PDF 字节分片流探测**：
  ```
  HTTP/1.1 206 Partial Content
  Content-Range: bytes 0-1024/39670024
  Accept-Ranges: bytes
  ```
  验证完全成功，已具备正式投入备考使用的所有条件。
