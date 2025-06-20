
<div align="center">

  <h1>🚀 React Native Link Lib</h1>
  <p><strong>React Native依赖管理解决方案</strong></p>
  <p>一键安装 • 零配置集成 • 16个精选原生库</p>
  
  <p>
    <a href="https://badge.fury.io/js/react-native-link-lib"><img src="https://badge.fury.io/js/react-native-link-lib.svg" alt="npm version" height="20"/></a>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" height="20"/></a>
    <a href="http://www.typescriptlang.org/"><img src="https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg" alt="TypeScript" height="20"/></a>
    <a href="https://reactnative.dev/"><img src="https://img.shields.io/badge/React%20Native-0.60+-blue.svg" alt="React Native" height="20"/></a>
  </p>
  
  <p align="center">
    <a href="#-快速开始"><b>快速开始</b></a> •
    <a href="#-核心优势"><b>核心优势</b></a> •
    <a href="#-已集成库"><b>已集成库</b></a> •
    <a href="#-系统要求"><b>系统要求</b></a> •
    <a href="#-最佳实践"><b>最佳实践</b></a> •
    <a href="#-故障排除"><b>故障排除</b></a>
  </p>
</div>

---

## 🎯 核心优势

<div class="feature-grid">

### ⚡ 开发体验

<div class="feature-cards">

<div class="feature-card">

#### 🚀 快速安装

- 一条命令完成所有配置
- 智能依赖解析
- 自动版本兼容性检测

</div>

<div class="feature-card">

#### 🎯 零学习成本

- 无需了解复杂的原生配置
- 开箱即用的API设计
- 完善的TypeScript类型支持

</div>

<div class="feature-card">

#### 🛡️ 稳定性

- 经过多个项目验证
- 高兼容性
- 持续维护更新

</div>

<div class="feature-card">

#### 🔧 智能化管理

- 自动处理原生依赖冲突
- 统一的版本管理策略
- 一键更新所有集成库

</div>

</div>

</div>

### 📦 精选集成库生态系统

<div class="library-intro">

> **16个精心挑选的原生库，覆盖90%的移动应用开发场景**

</div>

<details open>
<summary class="category-title"><h4>🎨 UI & 交互组件 (6个)</h4></summary>

<div class="library-table">

| 库名 | 功能亮点 | 版本 | 使用场景 |
|:-----|:---------|:-----|:----------|
| **@react-navigation/native** | 🧭 导航核心 | `6.1.10` | 页面路由、导航栈管理 |
| **@shopify/flash-list** | ⚡ 超高性能列表 | `1.7.3` | 大数据量列表渲染 |
| **react-native-pager-view** | 📱 原生滑动 | `6.6.1` | 轮播图、Tab切换 |
| **react-native-popover-view** | 💬 智能弹窗 | `6.1.0` | 提示框、菜单弹出 |
| **react-native-safe-area-context** | 🛡️ 安全区域 | `4.5.0` | 适配刘海屏、状态栏 |
| **react-native-screens** | 🚀 屏幕优化 | `3.20.0` | 原生级别的页面性能 |

</div>

</details>

<details>
<summary class="category-title"><h4>🎯 数据存储 & 选择器 (3个)</h4></summary>

<div class="library-table">

| 库名 | 功能亮点 | 版本 | 使用场景 |
|:-----|:---------|:-----|:----------|
| **@react-native-async-storage/async-storage** | 💾 异步存储 | `1.23.1` | 用户设置、缓存数据 |
| **@react-native-picker/picker** | 🎛️ 原生选择器 | `2.7.7` | 下拉选择、时间选择 |
| **react-native-storage** | 🗃️ 智能存储 | `1.0.1` | 复杂数据结构存储 |

</div>

</details>

<details>
<summary class="category-title"><h4>🎬 多媒体处理 (4个)</h4></summary>

<div class="library-table">

| 库名 | 功能亮点 | 版本 | 使用场景 |
|:-----|:---------|:-----|:----------|
| **react-native-audio-recorder-player** | 🎵 音频处理 | `3.6.12` | 语音录制、音乐播放 |
| **react-native-fast-image** | 🖼️ 图片加载 | `8.6.3` | 高性能图片缓存 |
| **react-native-video** | 🎥 视频播放 | `5.2.1` | 视频流媒体播放 |
| **react-native-view-shot** | 📸 截图工具 | `3.8.0` | 页面截图、分享功能 |

</div>

</details>

<details>
<summary class="category-title"><h4>🎨 视觉效果 & Web (3个)</h4></summary>

<div class="library-table">

| 库名 | 功能亮点 | 版本 | 使用场景 |
|:-----|:---------|:-----|:----------|
| **react-native-linear-gradient** | 🌈 渐变效果 | `2.8.3` | 背景渐变、按钮美化 |
| **react-native-svg** | 🎯 矢量图形 | `12.3.0` | 图标、复杂图形绘制 |
| **react-native-webview** | 🌐 Web容器 | `13.10.5` | 内嵌网页、混合开发 |

</div>

</details>



## 🚀 快速开始

<div class="installation-guide">

### ⚡ 安装流程

<div class="installation-steps">

<div class="step">

#### 步骤 1️⃣ 安装主库

选择您喜欢的包管理器安装：

```bash
# 使用 npm
npm install react-native-link-lib

# 或使用 yarn
yarn add react-native-link-lib

# 或使用 pnpm
pnpm add react-native-link-lib
```

</div>

<div class="step">

#### 步骤 2️⃣ iOS 配置（仅需一次）

在您的 `ios/Podfile` 中添加以下配置：

```ruby
# 在 Podfile 顶部添加
prefix = 'react-native/node_modules'
pod 'react-native-link-lib', :path => "#{prefix}/react-native-link-lib"
```

然后运行 Pod 安装：

```bash
cd ios && pod install
```

</div>

<div class="step">

#### 步骤 3️⃣ 验证安装

创建一个测试文件验证所有库都已正确集成：

```javascript
// TestIntegration.js
import React from 'react';
import { View, Text } from 'react-native';

// 🎯 存储相关
import AsyncStorage from '@react-native-async-storage/async-storage';
import Storage from 'react-native-storage';

// 🧭 导航相关
import { NavigationContainer } from '@react-navigation/native';

// 🎨 UI组件
import { FlashList } from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// 🎬 多媒体
import Video from 'react-native-video';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

// 🌐 Web & SVG
import { WebView } from 'react-native-webview';
import Svg, { Circle } from 'react-native-svg';

const TestIntegration = () => {
  return (
    <SafeAreaProvider>
      <LinearGradient colors={['#667eea', '#764ba2']} style={{flex: 1}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: 'white', fontSize: 24, fontWeight: 'bold'}}>
            🎉 所有库已成功集成！
          </Text>
          <Svg height="50" width="50">
            <Circle cx="25" cy="25" r="20" fill="white" />
          </Svg>
        </View>
      </LinearGradient>
    </SafeAreaProvider>
  );
};

export default TestIntegration;
```

</div>

</div>

<div class="success-message">

✅ **如果代码运行无误，说明安装成功！现在您可以开始使用所有集成的库了。**

</div>

</div>

## 📋 系统要求

<div class="requirements-table">

| 环境 | 最低版本 | 推荐版本 |
|:------:|:----------:|:----------:|
| **React Native** | `0.60.0` | `0.72.x` |
| **iOS** | `11.0` | `15.0+` |
| **Android** | `API 21` | `API 33+` |
| **Node.js** | `12.0.0` | `18.x LTS` |
| **Xcode** | `12.0` | `14.x` |
| **Android Studio** | `4.0` | `2022.x` |

</div>

## 🛠️ 最佳实践

<div class="best-practices">

### 🎯 项目初始化

<div class="code-block-container">

```bash
# 1. 创建新项目
npx react-native init MyApp --template react-native-template-typescript

# 2. 安装 React Native Link Lib
cd MyApp && npm install react-native-link-lib

# 3. iOS 配置
cd ios && pod install && cd ..

# 4. 启动项目
npx react-native run-ios  # 或 run-android
```

</div>

### 🚀 性能优化建议

<div class="optimization-tips">

<details open>
<summary class="tip-category"><h4>📱 移动端性能优化</h4></summary>

<div class="tip-content">

- **使用 FlashList 替代 FlatList**：提升列表渲染性能
- **使用 FastImage 替代 Image**：优化图片加载和缓存
- **合理使用 react-native-screens**：启用原生屏幕优化
- **配置 SafeAreaContext**：适配各种屏幕尺寸

</div>

</details>

<details>
<summary class="tip-category"><h4>🔧 开发效率提升</h4></summary>

<div class="tip-content">

- **TypeScript 配置**：充分利用类型检查
- **ESLint + Prettier**：保持代码风格一致
- **Flipper 调试**：使用专业调试工具
- **热重载**：提升开发体验

</div>

</details>

</div>

</div>

## 🔧 故障排除

<div class="troubleshooting">

### 🚨 常见问题快速解决

<div class="troubleshooting-sections">

<details open>
<summary class="issue-category"><h4>❌ iOS 相关问题</h4></summary>

<div class="issue-table">

| 问题症状 | 可能原因 | 解决方案 |
|:----------:|:----------:|:----------|
| **Pod 安装失败** | CocoaPods 版本过旧 | `sudo gem install cocoapods` |
| **编译错误** | 缓存问题 | `cd ios && pod deintegrate && pod install` |
| **模拟器启动失败** | Xcode 版本不兼容 | 更新到最新 Xcode 版本 |
| **真机调试失败** | 证书配置问题 | 检查开发者证书和 Provisioning Profile |

</div>

</details>

<details>
<summary class="issue-category"><h4>🤖 Android 相关问题</h4></summary>

<div class="issue-table">

| 问题症状 | 可能原因 | 解决方案 |
|:----------:|:----------:|:----------|
| **Gradle 构建失败** | 依赖冲突 | `cd android && ./gradlew clean` |
| **APK 安装失败** | 签名问题 | 检查 keystore 配置 |
| **模拟器连接失败** | ADB 问题 | `adb kill-server && adb start-server` |
| **性能问题** | 内存不足 | 增加模拟器内存分配 |

</div>

</details>

<details>
<summary class="issue-category"><h4>⚡ Metro 和缓存问题</h4></summary>

<div class="code-block-container">

```bash
# 清理所有缓存
npm start -- --reset-cache

# 清理 node_modules
rm -rf node_modules && npm install

# 清理 iOS 缓存
cd ios && rm -rf build && pod install

# 清理 Android 缓存
cd android && ./gradlew clean
```

</div>

</details>

</div>

</div>



## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。
