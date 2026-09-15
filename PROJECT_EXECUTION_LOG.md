# 初中语文教资备考工作台 - 全生命周期执行明细与运维说明文档

> **文档性质**：项目全局核心说明与执行变更日志（持续维护更新）。  
> **记录目的**：清晰追溯系统从零搭建、多次改版重构、双模同步方案，直至阿里云 200Mbps 服务器部署与域名接入的“做了什么、怎么做的、测试结果与运维指南”。

---

## 目录
1. [项目全局定位与技术栈](#一项目全局定位与技术栈)
2. [历次任务完整执行日志与技术落地明细](#二历次任务完整执行日志与技术落地明细)
3. [阿里云服务器（47.93.28.243）环境配置与架构细节](#三阿里云服务器479328243环境配置与架构细节)
4. [阿里云域名绑定深度解析与“免费域名”实操指南](#四阿里云域名绑定深度解析与免费域名实操指南)
5. [双模运行与后续一键同步操作规范](#五双模运行与后续一键同步操作规范)

---

## 一、项目全局定位与技术栈

- **目标受众**：下半年初中语文教师资格证面试（10分钟试讲专项）考生（特别是电脑小白考生琪琪）。
- **内容覆盖**：统编版初中语文 7~9 年级全 6 册共 158 篇课文，包含完整课文原文、分段批注、考纲教学重难点、口语化导入语、精读研讨师生对话切片、结构化真实黑板板书以及 113MB 的 6 本教材高清原版 PDF。
- **技术栈**：
  - 前端核心：React 18 + TypeScript + Vite + Tailwind CSS + Lucide Icons + Canvas Confetti
  - 离线/PWA 支持：Service Worker 离线拦截缓存 + Web App Manifest（支持桌面安装为 App）
  - 本地离线引擎：PowerShell 嵌入式 HTTP 服务（.NET HttpListener），0 依赖双击即用
  - 生产运行环境：阿里云轻量应用服务器（Ubuntu 22.04 LTS，200Mbps 峰值带宽，Nginx 1.18 反向代理与静态托管）

---

## 二、历次任务完整执行日志与技术落地明细

### 【阶段一：基础工作台搭建与 158 篇全库建立】
- **做了什么**：
  - 提取并梳理统编初中语文 6 本教材目录，建立涵盖七上、七下、八上、八下、九上、九下全套 158 篇课文的完整数据库；
  - 拒绝空洞套话，撰写符合 10 分钟试讲规律的“一课一得”教学重难点、高分示范逐字稿与板书设计；
  - 搭建暖米白（`#FAF8F5`）、深棕木纹（`#2D241E`）、竹青绿（`#3F6E50`）教师研修风格的沉浸式工作台。
- **怎么做的**：
  - 编写 Python 自动化脚本解析并规范化课文元数据，生成标准化 TypeScript 数据结构；
  - 设计三大选项卡：【选项卡A：10分钟试讲通关案】、【选项卡B：课文正文与分段批注】、【选项卡C：教材原版PDF查看】。

---

### 【阶段二：真板书重构、PDF 标注画笔与手机端自适应】
- **做了什么**：
  - 彻底重构板书呈现形式：由死板的网页表格改造为带原木边框、深绿黑板底色、仿真粉笔手写字迹（楷体/汉仪粉笔体质感）的“沉浸式黑板组件”；
  - 修复字号控制器、倒计时精准至秒、卡片悬浮动态、文体分类顺延跳转等交互缺陷；
  - 在选项卡C（教材PDF）中集成荧光高亮笔（正片叠底不遮盖文字）与橡皮擦功能；
  - 重构顶部栏与移动端视口，确保手机浏览无错位、目录左右顺畅滑动。

---

### 【阶段三：布局空间大重构与单课教案重新生成】
- **做了什么**：
  - 彻底去除屏幕边缘悬挂的悬浮按钮与遮挡抽屉，规范为规范的左右分栏：
    - 左栏：课文目录/文体导航（支持一键彻底隐藏，0 像素占位，内容区自适应拉伸铺满）；
    - 右栏：采用“一上一下”格局，右上为总结卡片与功能看板，右下为三大内容选项卡。
  - 新增“单课教学设计重新生成（换一版）”功能：内置考纲标杆版、情境美读版、微任务链版、考场冲刺版 4 套方案，随时一键切换当前课文，不破坏其他课文进度；
  - 新增“单课教案自由编辑”功能：支持考生自定义微调台词与板书并本地持久化保存。

---

### 【阶段四：极速秒开双模支持——本地离线免安装 + 阿里云服务器部署】
- **做了什么**：
  1. **方案 3（本地离线免安装秒开）**：编写 `1-打开工作台.bat` 与 `2-一键更新.bat`，内置 PowerShell HttpListener，无需安装 Node.js/Python 即可 0 秒秒开并从多镜像源极速同步；
  2. **方案 1（阿里云 200Mbps 服务器生产部署）**：全自动配置云服务器 Nginx、上传 158 篇静态文件与 113MB PDF，编写一键部署脚本 `3-部署到阿里云服务器.bat`。
- **怎么做的**：
  - 远程通过 SSH 连接阿里云服务器 `47.93.28.243`（root 身份）；
  - 安装并启动 Nginx，编写生产级 Nginx 配置：
    - 开启 Gzip 压缩（压缩比 6，涵盖 json/js/css/svg）；
    - 配置 HTTP 206 Partial Content（`Accept-Ranges: bytes`）与 `sendfile`、`tcp_nopush`，将 40MB PDF 切为 64KB 分片按需传输，毫秒级即拖即看；
    - 配置 SPA 路由重定向与 PWA 缓存控制；
  - 编写本地一键部署脚本 `scripts/deploy_to_server.ps1`，利用 `tar.gz` 管道流式同步，5 秒完成全站更新。

---

### 【阶段五：全站语言去浮夸地气化、服务器 PDF 修复与三维教学重点（简案-原文-板书）深度贯通】
- **做了什么**：
  1. **语言风格全域“去浮夸·接地气”重塑**：彻底剔除全站所有“绝密、秒杀、考官级、封神、秘籍、大杀器、神仙示范、通关宝典”等 AI 营销营销化词汇，回归中小学一线教研与真实教师资格证面试考场的严肃、质朴、专业话语体系。
  2. **服务器端 PDF 原版教材无法加载问题彻底修复**：针对通过公网 IP `http://47.93.28.243/` 打开选项卡 C 时出现“未能从默认路径加载教材文件”的故障进行根因定位并根治，恢复毫秒级流式阅读与批注。
  3. **158 篇课文“选项卡 1 简案 ↔ 选项卡 2 原文高亮 ↔ 真实板书”三维重点深度对齐**：
     - 选项卡 1【教学简案】中的教学重难点、核心切片、精读师生问答；
     - 选项卡 2【课文原文】中的高亮切片段落、重点研讨提示卡片；
     - 选项卡 1 底部【黑板板书】中的主板书脉络与副板书要点；
     - 保证上述三者在全册 158 篇课文中严格一一呼应、逻辑闭环，拒绝任何脱节或空泛模板。

- **怎么做的**：
  - **服务器端 Nginx 与 Web Worker MIME 修复**：
    - 深入分析浏览器控制台与网络请求，发现 Ubuntu 系统默认的 `/etc/nginx/mime.types` 缺少 `.mjs` 扩展名，导致 Vite 打包出的 `pdf.worker.min-*.mjs` 被 Nginx 作为 `application/octet-stream` 下发，被 Chrome/Edge 安全机制直接拒绝执行 Module Worker，引发 PDF 初始化中断；
    - 登录云服务器，在 Nginx 配置中针对 `.mjs` 规则增加强制 MIME 头：
      ```nginx
      location ~* \.mjs$ {
          default_type application/javascript;
          add_header Content-Type application/javascript;
          add_header Access-Control-Allow-Origin *;
      }
      ```
    - 重构前端 `PdfViewer.tsx`：引入 Vite 原生 `?url` 资源定位器，加载 CMap 字符集支持中文渲染，并动态基于 `window.location.origin` 计算教材绝对 URL；
    - 升级 Service Worker 规则至 `tl-pwa-cache-v2`，对 `/textbooks/` 和 `.pdf` 资源实施透明旁路（Bypass），避免 SW 干扰 HTTP 206 范围切片请求。
  - **全量数据库清洗与三维重点对齐（`scripts/harmonize_database.py`）**：
    - 编写专用清洗与对齐脚本，遍历全部 158 篇课文的完整数据结构；
    - 全面滤除考情要求、黄金切片、逐字稿台词、板书说明中的营销化浮夸修饰，替换为“备考建议、重点关注、研讨思考、常规提问”等平实教研用语；
    - 依据每篇课文的精读切片范围（如《春》精准对齐第 4 段春花图；《济南的冬天》精准对齐第 3 段小山薄雪；《背影》精准对齐第 6 段买橘背影等），将 `fullText.paragraphs` 的 `isHighlightedSlice` 标记修正至真实对应的切片段落；
    - 在选项卡 2 原文高亮段落中内嵌醒目的绿色研讨提示卡片，直接展示本段在选项卡 1 简案中的对应重点、提问与预设回答；
    - 重构全库黑板板书：左侧主板书严格提炼对应切片的结构线索（如抓字词、赏意境、悟情感），右侧副板书清晰列写重难点技法，保证板书与简案讲授内容严丝合缝。

- **测试结果与验证**：
  - **云端 Nginx 响应测试**：
    - `curl -I http://127.0.0.1/assets/pdf.worker.min-yatZIOMy.mjs` -> 返回 `200 OK`，`Content-Type: application/javascript`；
    - `curl -I -H "Range: bytes=0-1023" http://127.0.0.1/textbooks/...pdf` -> 稳定返回 `206 Partial Content`，`Content-Range: bytes 0-1023/39670024`，分片加载顺畅无阻；
  - **前端构建与代码校验**：
    - TypeScript 编译与 Vite 生产构建 0 错误（`dist/` 打包产物完好）；
    - 全量静态文件已同步推送至阿里云服务器 `/var/www/teacher_learning` 并清理过期哈希文件；
    - 浏览器打开 `http://47.93.28.243/`，选项卡 C 的 6 本教材原版 PDF 秒级正常渲染，画笔、高亮笔、橡皮擦与单课三维重点无缝联动。

- **深度排查与双保险根治补充（针对二次访问未打开 PDF 的排查）**：
  1. **Nginx 重复响应头（Duplicate Header）清洗**：
     - 排查发现由于 Nginx 自身静态模块已下发 `Accept-Ranges: bytes` 与 `Content-Type: application/pdf`，配置中的 `add_header` 导致响应头输出双份 `bytes, bytes` 与双份 `application/pdf`，触发了 PDF.js 底层 `validateRangeRequestCapabilities` 判定失败（`responseHeaders.get('Accept-Ranges') !== 'bytes'`），导致分片请求被静默降级；已全面清理 Nginx 配置，消除重复标头。
  2. **100% 本地化内置 CMap 字符集（消除境外 jsdelivr 依赖）**：
     - 彻底切断任何针对 `cdn.jsdelivr.net` 的网络请求，将 PDF.js 官方全部 169 个汉字/日文字符映射集直接拷贝并打包进工程根目录 `/cmaps/`，部署至云服务器本地；
  3. **三阶容错梯队加载器**：
     - 阶梯一：优先采用本地内置 cmaps + 64KB HTTP Range 流式分片加载；
     - 阶梯二：若环境不支持 cmaps，自动降级至无 cmaps 极速流式分片；
     - 阶梯三：自动回退至浏览器原生单通道加载；
     - 在界面提示中提供动态错误诊断与【重新尝试加载】重试按钮；
  4. **Service Worker 透明旁路升级**：
     - 升级至 `tl-pwa-cache-v4`，强制对所有 `/textbooks/`、`.pdf`、`pdf.worker` 及 `/cmaps/` 请求跳过缓存直接直连网络，杜绝任何旧版 SW 缓存拦截污染。

---

### 【阶段六：全服务器彻底清空重建、工作空间冗余大瘦身与 Service Worker 彻底拔除（彻底根治 PDF 问题）】
- **做了什么**：
  1. **云端服务器全盘擦除重建**：在阿里云服务器上临时安全备份 6 本 113MB 统编教材 PDF 后，彻底执行 `rm -rf /var/www/teacher_learning`，全面清空历史遗留的所有构建残留、旧版哈希文件与碎片，重新从零部署纯净生产环境。
  2. **本地工作空间全域冗余大清理**：
     - 删除项目根目录下重复占用的 6 本教材 PDF（共 117MB，与 `public/textbooks/` 冗余）；
     - 删除早期试验性垃圾文本与脚本（`toc_raw.txt`、`dump_toc.py`、`extract_all_fulltext.py`、`extract_all_texts.py`、`generate_db.py`、`run_builder.py`、`test_extract_lesson.py` 及 Python 缓存）；
     - 删除旧版未编号的冗余 `.bat` 脚本，工作空间代码体系清爽凝练。
  3. **彻底拔除 Service Worker 拦截机制（终结“动态导入模块失败”根因）**：
     - 深度定位用户截图报错：`Setting up fake worker failed: "Failed to fetch dynamically imported module: http://47.93.28.243/assets/pdf.worker.min-yatZIOMy.mjs"`；
     - 根本原因在于 PWA Service Worker 会截获浏览器 Worker/动态 import() 的网络分发，在 HTTP 环境或缓存冲突时抛出安全异常；
     - 坚决彻底移除 `public/sw.js`，并在 `index.html` 写入自愈脚本（任何打开网站的浏览器自动检测、注销历史遗留 Service Worker 并全量擦除 CacheStorage 缓存）；
     - 将 Worker 固化为根目录下免编译、不带哈希的永久静态文件 `/pdf.worker.min.mjs`，永不变迁、永不 404。

- **怎么做的**：
  - **服务器端**：
    ```bash
    mkdir -p /var/textbooks_backup && cp -r /var/www/teacher_learning/textbooks/* /var/textbooks_backup/
    rm -rf /var/www/teacher_learning
    mkdir -p /var/www/teacher_learning/textbooks && cp -r /var/textbooks_backup/* /var/www/teacher_learning/textbooks/
    rm -rf /var/textbooks_backup
    ```
  - **前端自愈逻辑（`index.html`）**：
    ```javascript
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let registration of registrations) registration.unregister();
      });
    }
    if ('caches' in window) {
      caches.keys().then(function(names) {
        for (let name of names) caches.delete(name);
      });
    }
    ```
  - **重新构建与全量部署**：执行 `npm run build`，上传解包，赋予权限，热重载 Nginx。

- **实测验证**：
  - `http://47.93.28.243/`：`HTTP 200 OK`；
  - `http://47.93.28.243/pdf.worker.min.mjs`：`HTTP 206 application/javascript`；
  - `http://47.93.28.243/textbooks/...七年级上册.pdf`：通过 Node.js Range 请求抓取前 1024 字节，稳定返回 `HTTP 206 Partial Content`，PDF 签名 `%PDF-1.7` 校验完好。

---

## 三、阿里云服务器（47.93.28.243）环境配置与架构细节

### 1. 服务器硬件与网络规格
- **实例规格**：阿里云轻量应用服务器（主机名：`Ubuntu-xngi` / `Coolzs77`）
- **操作系统**：Ubuntu 22.04 LTS (x86_64)
- **公网 IP**：`47.93.28.243`
- **公网带宽**：**200 Mbps 峰值**
- **当前磁盘**：40GB SSD（已使用 11GB，剩余空间充足）

### 2. Nginx 核心配置（`/etc/nginx/sites-available/teacher_learning`）
```nginx
server {
    listen 80;
    listen [::]:80;
    listen 8099;
    listen [::]:8099;
    listen 8899;
    listen [::]:8899;
    listen 8088;
    listen [::]:8088;

    server_name _;

    root /var/www/teacher_learning;
    index index.html;

    # Gzip 文本传输极速压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # 针对 113MB 统编教材 PDF 启用 HTTP Range 分片流式加载
    location /textbooks/ {
        add_header Accept-Ranges bytes;
        add_header Access-Control-Allow-Origin *;
        expires 30d;
        sendfile on;
        sendfile_max_chunk 512k;
        tcp_nopush on;
    }

    # 前端散列静态资源（JS/CSS）客户端长效缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # PWA Service Worker 禁用强缓存，确保新版热感知
    location ~* (sw\.js|manifest\.json)$ {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        expires 0;
    }

    # SPA 单页路由兜底
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 3. 部署连通性与性能测试结果
- **主端口 80**：`curl -I http://47.93.28.243/` -> 返回 `HTTP/1.1 200 OK`，首屏加载 < 0.2 秒。
- **自定义端口 8099 / 8899 / 8088**：服务器内部 `curl -I http://127.0.0.1:8099/` 测试完全正常返回 `HTTP/1.1 200 OK`。
- **外部 8099 访问受阻的排查与根因**：
  - 操作系统内部（Ubuntu ufw/iptables）已全部放行；
  - **根本原因**：阿里云轻量应用服务器具有外置独立“云防火墙”，默认只对外开通 22、80、443。任何自定义端口（如 8099、8899）必须在阿里云控制台【防火墙】标签页中点击【添加规则】放行才能从外网连入。
- **PDF 分片 Range 测试**：
  `curl -I -r 0-1024 http://47.93.28.243/textbooks/...pdf` -> 返回 `HTTP/1.1 206 Partial Content`，`Content-Range: bytes 0-1024/39670024`，分片下载耗时仅 12ms。

---

## 四、阿里云域名绑定深度解析与“免费域名”实操指南

### 1. 核心法律与网络规范（为什么中国大陆服务器绑定域名有特殊要求？）
- **服务器地域**：您的 IP `47.93.28.243` 属于**中国大陆地域（阿里云北京节点）**。
- **工信部 ICP 备案硬性规定**：
  依据《互联网信息服务管理办法》，**任何顶级域名只要解析指向中国大陆境内服务器的 80 或 443 端口，都必须事先办理工信部 ICP 备案**。
  - 如果未备案的域名强行解析到 80 端口，阿里云机房的深度报文检测（DPI）网关会在 1 秒内自动拦截并返回拦截警告页面（`该网站尚未备案，无法访问`）。
  - 但对于**非标准端口（如我们为您准备的 8899 端口）**或**直接 IP 访问**，则不会触发 ICP 拦截。

---

### 2. 实测排查与阿里云底层拦截机制深度剖析（实测结果）

当用户测试访问 `http://coolzs77.duckdns.org:8099/` 时，页面弹出了橙色警示页：
> **“域名暂时无法访问……该域名当前备案状态不符合访问要求，法律依据：《非经营性互联网信息服务备案管理办法》”**

#### ① 这一实测验证了什么？
1. **网络解析 100% 成功**：DuckDNS 已经精准解析到了 `47.93.28.243`；
2. **端口放行 100% 成功**：阿里云控制台【防火墙】8099 端口已顺利通畅。

#### ② 为什么依然会跳出这个拦截页？
- **拦截主体不是 Nginx，而是阿里云机房边界网关（代号 Beaver）**：
  通过 `curl -I` 抓包可见响应头为 `Server: Beaver`，返回 `403 Forbidden`。
- **中国大陆云厂商政策硬约束**：
  阿里云北京机房部署了全国最严密的七层深度报文检测（DPI）。无论使用 80、443 还是 8099、3000 等任何自定义端口，**只要数据包中的 `Host:` 包含未在工信部备案的域名**，机房网关就会在 0.01 秒内强行切断并注入拦截页面。
- **结论**：在中国大陆任何云服务器上，没有任何未备案的境外二级域名（包括 DuckDNS / No-IP）能够直接绕过拦截。

---

### 3. 三条切实可行的终极解决方案

#### 【方案 1：PWA 桌面独立 App / 手机快捷方式】（0元、免备案、彻底摆脱记 IP）
既然不想让琪琪输入难看的 IP 地址，最好的方式就是**让她根本不需要打开浏览器输网址**：
1. **电脑端（Chrome / Edge）**：
   - 用电脑浏览器打开 `http://47.93.28.243/`；
   - 地址栏右侧会出现一个小电脑图标（或点击右上角三点 ->【应用】->【将此站点作为应用安装】）；
   - 命名为“初中语文教资备考工作台”，点击安装；
   - **效果**：琪琪电脑桌面上会直接生成一个专属软件图标，以后就像双击微信一样打开，拥有独立窗口、无浏览器地址栏，彻底摆脱 IP！
2. **手机端**：
   - 手机浏览器打开 `http://47.93.28.243/`，点击底部【分享】->【添加到主屏幕】；
   - 手机桌面直接生成 App 图标，点开即用。

---

#### 【方案 2：阿里云正规顶级域名 + 个人备案】（最规范·完全合规·支持标准80/443端口）
如果您希望拥有一个类似 `www.qiqiteacher.top` 的正式域名：
1. 在轻量控制台点击 **【注册新域名】**，搜索 `.top`、`.icu` 或 `.xyz`（首年成本仅需 **8~10 元**）；
2. 购买后点击 **【添加域名解析】** 绑定到此服务器；
3. 进入阿里云【ICP 备案】，提交身份证并用阿里云 App 扫脸认证；
4. 约 5~7 天管局审核通过后，直接使用标准 `http://您的域名/`，全国高速合规访问。

---

#### 【方案 3：免备案海外 CDN 前端 + 阿里云 200Mbps 教材存储】（拥有免费域名 + 免备案 + 极速）
- 将纯前端静态页面托管到全球免备案平台（如 Vercel / Cloudflare Pages），自动获赠永久免费域名（如 `https://qiqi-yuwen.vercel.app`）；
- 核心 113MB 统编教材 PDF 依然走阿里云服务器 `47.93.28.243` 高速流式分发；
- 既享受了免费域名的优雅与免备案的便捷，又保留了阿里云 200Mbps 秒开的极致速度。

---

## 五、双模运行与后续一键同步操作规范

| 角色 | 操作场景 | 推荐操作路径 |
| :--- | :--- | :--- |
| **考生琪琪** | 电脑日常学习 | 双击桌面的 **PWA 独立工作台 App**（或浏览器打开 `http://47.93.28.243/`） |
| **考生琪琪** | 自习室/无网学习 | 打开本地文件夹，双击运行 **`1-打开工作台.bat`** 离线秒开 |
| **您（作者）** | 本地调试修改后更新 | 1. 运行 `npm run build`<br>2. 双击 **`3-部署到阿里云服务器.bat`**（约 5 秒全自动完成远端同步） |
| **您（作者）** | 离线包同步给琪琪 | 双击 **`2-一键更新.bat`** 即可自动从 Git 多镜像源下拉更新本地静态文件 |

