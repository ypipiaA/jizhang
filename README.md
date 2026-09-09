# 生活记账

一款适合日常使用的中文记账应用，提供网页、离线 HTML 和 Android 安装版。支持收入支出记录、账单查询和统计图表，账本默认保存在当前设备。

- [打开网页版](https://jizhang-d9k.pages.dev/)
- [安卓下载页面](https://jizhang-d9k.pages.dev/downloads/)
- [下载 Android 1.0.1 安装包](https://jizhang-d9k.pages.dev/downloads/counts-1.0.1.apk)

## 功能

- 记录收入与支出，选择分类、平台和日期，编辑备注或删除记录。
- 按月份查看账单、收支汇总，以及分类、每日和年度统计图表。
- 导入、导出 JSON 备份，方便迁移账本。
- 可选 Cloudflare KV 云同步，默认关闭；开启后需要网络和可用的同步服务。
- 适配手机界面，Android 版支持系统文件选择器和返回键。

## Android 安装与数据迁移

使用手机打开上面的下载页面或 APK 链接，下载后按系统提示安装。需要 Android 8.0 及以上，并保持 Android System WebView / Chrome 更新。

Android 版将网页界面和图表资源内置于安装包，可离线记账，无需 Python、电脑或本地服务器。网页版和 Android 版分别保存数据；迁移时在原应用的“设置”中导出 JSON，再到新应用导入。

卸载应用、清除应用数据或清理浏览器站点数据之前，请先导出备份。更新 Android 版时使用同一签名的安装包覆盖安装。更多说明见 [ANDROID.md](ANDROID.md)。

## 本地运行

需要 Python 3.10+，本地服务仅使用标准库，无需安装 Python 第三方依赖。

```sh
git clone https://github.com/ypipiaA/jizhang.git
cd jizhang
python app.py
```

浏览器访问 `http://localhost:5000`。服务启动时会初始化本地 `records.db`；该数据库不上传 GitHub。当前网页账本主要保存在浏览器 localStorage 中。本地 Python 服务不提供 Cloudflare KV 运行环境，云同步依赖原有线上服务。

网页图表和字体使用在线资源，首次加载需要网络。生成内置图表的单文件离线版本：

```sh
python build_offline.py
```

输出为 `dist/生活记账.html`。首次缺少 Chart.js 缓存时，构建需要联网下载资源。

## 构建 Android 安装包

准备 Python 3.10+、JDK 17+ 和 Android SDK，安装 `platforms;android-36` 与 `build-tools;36.0.0`，然后运行：

```sh
python build_android.py --java-home "<JDK目录>" --sdk "<Android SDK目录>"
```

构建不依赖 Gradle。当前应用 ID 为 `com.counts.life`，版本为 `1.0.1`（versionCode `2`），输出为 `dist/android/counts-1.0.1.apk`。后续版本以 `android/app/src/main/AndroidManifest.xml` 为准。

签名保存在本机 `.android-signing/`，请单独安全备份整个目录。后续覆盖升级必须沿用原签名；GitHub 源码不包含签名密钥、密码或个人账本。首次在新机器构建前，应恢复原有签名备份。

## 验证

需要 Node.js 18+，运行下载响应测试无需安装 npm 依赖：

```sh
node --test tests/downloads.test.mjs
```

测试覆盖 APK 下载类型与文件名、文件内容、HEAD 请求，以及缺失或无效 APK 的处理。Android 验证环境和仪器测试运行方法见 [ANDROID.md](ANDROID.md#已验证)。

## 发布到正式网站

本项目唯一正式 Cloudflare Pages 项目为 `jizhang`，域名为 `https://jizhang-d9k.pages.dev/`。发布必须遵守 [AGENTS.md](AGENTS.md)，保留现有应用身份、签名、数据库绑定和用户数据。

先构建 Android 安装包，再准备下载资源并发布：

```sh
python build_download_site.py
python cf_deploy.py
```

发布所需的 `CF_TOKEN` 和 `CF_ACC` 通过本机环境提供，不写入代码、公开文件或日志。`npm run deploy` 同样调用本目录 `cf_deploy.py`。脚本会校验应用身份、远端项目名和正式域名；校验失败必须停止，不得修改目标变量或改用手工上传、临时命令、其他项目脚本绕过。

Pages 与独立 Worker 是不同发布目标，不能用 `wrangler deploy` 的成功代替 Pages 发布验证。生成的 ZIP 仅用于本地检查或归档。发布后应实际访问正式首页确认“生活记账”，并核对线上 APK 与本地文件的 SHA-256。下载文件使用明确版本号。

将源码推送到 GitHub 不代表网站或 APK 已更新。APK、构建缓存与签名文件被 Git 忽略，发布前需要在本机构建和准备。

## 目录说明

| 路径 | 用途 |
| --- | --- |
| `public/` | 网页界面、业务逻辑、静态资源、下载页与 Pages Worker |
| `android/app/src/main/` | Android 宿主源码、清单和图标 |
| `app.py`、`database.py` | Python 本地服务与旧版数据库支持 |
| `main.py` | 旧版 Tkinter 桌面入口 |
| `build_offline.py` | 生成单文件离线网页 |
| `build_android.py` | 编译、签名和校验 Android 安装包 |
| `build_download_site.py` | 准备带版本号的 APK 和下载页面 |
| `cf_deploy.py` | 带目标与应用身份校验的唯一 Pages 发布入口 |
| `tests/` | 下载响应测试与 Android 仪器测试 |

本地数据、环境凭证、签名材料及生成的构建产物不应提交到仓库。
