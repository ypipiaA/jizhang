# 生活记账安卓版

安装包：`dist/android/counts-1.0.1.apk`。新版使用“账本＋人民币符号＋记账笔”图标，可直接覆盖安装 1.0.0。

把 APK 发到安卓手机，点击文件，按系统提示允许本次安装即可。支持 Android 8.0 及以上，手机的 Android System WebView / Chrome 应保持更新。无需 Python、电脑或本地服务器；记账、账单和统计都能离线使用。

在应用右上角“设置”中可以导入、导出 JSON 备份。原网页中的数据不会自动出现在新安装的 App 中；可在原网页导出备份，再在 App 中导入。卸载或清除应用数据前请先导出备份。

云同步保留原有服务和设置，默认关闭；开启后需要网络，服务可用性取决于原有 Cloudflare 部署。本次打包不会把电脑上的 `records.db` 或同步码装进 APK。

## 固定下载网址

先运行 `python build_download_site.py`，将带版本号的 APK 与下载页准备到本项目 `public/` 目录。随后仅使用本目录 `python cf_deploy.py` 发布；`npm run deploy` 也会调用同一脚本。发布目标固定为 Pages 项目 `jizhang`、正式域名 `jizhang-d9k.pages.dev`，并校验生活记账的应用身份。所需授权仅通过本机环境配置，不能写进发布文件。

生成的 ZIP 用于本地检查或归档。不要手动上传 ZIP、运行 `wrangler deploy`、使用其他项目的脚本或修改目标变量来绕过校验。目标或应用身份不匹配时必须停止发布。

完成部署后，1.0.1 的下载路径为 `/downloads/counts-1.0.1.apk`。下载文件始终使用明确版本号；更新版本会生成新的对应文件名。`/downloads/` 为下载页面。

仅提供网址不会把文件上传到服务器；发布后先访问正式域名，确认首页是生活记账，再验证下载响应为 APK，并核对与本地文件的 SHA-256 一致。缺失的安装包会返回 404，避免被网站首页替代。完成这些验证后才能报告发布成功。

## 再次构建

需要 Python 3.10+、JDK 17+ 和 Android SDK（Android API 36、Build Tools 36.0.0）。不需要 Gradle、npm 依赖或 Python 第三方库。

```powershell
python build_android.py --java-home "你的JDK目录" --sdk "你的AndroidSDK目录"
```

工具路径会保存在本机 `.android-build/toolchain.json`。同一台电脑以后直接运行：

```powershell
python build_android.py
```

`public/` 是界面和业务逻辑的唯一来源；脚本会复制资源、将 Chart.js 本地化，移除在线字体和 PWA 配置，再编译、签名、校验 APK。首次缺少 `.chart.cache.js` 时需要联网下载 Chart.js。

安卓宿主源码位于 `android/app/src/main/`，负责安全区域、键盘、返回手势、确认/输入对话框及系统文件选择器。页面运行在固定的本地 HTTPS 来源以保留本地存储和 Web Crypto 能力。联网仅供原有云同步使用。

## 签名与升级

这是用本项目独立密钥签名的安装版，非调试版。请妥善备份整个 `.android-signing/` 目录；其中的密钥和密码只保存在本机，已排除出版本控制。后续升级必须沿用它，否则无法覆盖安装并保留手机数据。

更新版本时修改 `AndroidManifest.xml` 的 `versionName` 并递增 `versionCode`，然后重新构建。安装新版时直接覆盖安装，不要先卸载旧版。

构建会验证 APK 签名、ZIP 完整性、资源和对齐，并输出 SHA-256 校验文件。`dist/`、`.android-build/` 和 `.android-signing/` 不提交到源码仓库。

## 已验证

在 Android 14 / WebView 146 的独立虚拟手机屏幕（360dp 宽）上验证了记账、收支汇总、备注编辑、统计图表、安卓返回键、通过系统文件选择接口导出和导入 JSON、重建页面后数据保留，以及删除记录。云同步保持关闭。未进行实体手机或其他安卓版本的实机测试。

测试源码在 `tests/android/`。需要重测时先构建 APK，再运行 `python tests/build_android_smoke.py`，通过 ADB 安装 App 和 `.android-build/smoke/counts-tests.apk`，然后执行：

```text
adb shell am instrument -w com.counts.life.tests/com.counts.life.tests.SmokeInstrumentation
```

测试会使用后台虚拟屏幕和临时备份文件，并在结束时恢复原本的本地数据；建议在专用测试模拟器运行。虚拟屏幕测试为避免后台帧率限制会关闭图表动画，正式 App 保留动画。
