# React Native Link Lib - 安装指南

## 🎉 零配置安装

本库已支持**零配置自动安装**，无需手动修改 Podfile！

## 快速开始

### 1. 安装库和依赖

```bash
# 使用 npm
npm install react-native-link-lib

# 使用 yarn
yarn add react-native-link-lib

# 使用 pnpm
pnpm add react-native-link-lib
```

### 2. 安装 Peer Dependencies

```bash
# 自动安装所有依赖（推荐）
bash <(curl -s https://raw.githubusercontent.com/your-repo/react-native-link-lib/main/scripts/install-deps.sh)

# 或者手动安装
npm install @react-native-async-storage/async-storage@1.23.1 \
            @react-native-picker/picker@2.7.7 \
            @react-navigation/native@6.1.10 \
            @shopify/flash-list@1.7.3 \
            react-native-audio-recorder-player@3.6.12 \
            react-native-fast-image@8.6.3 \
            react-native-linear-gradient@2.8.3 \
            react-native-pager-view@6.6.1 \
            react-native-popover-view@6.1.0 \
            react-native-safe-area-context@4.5.0 \
            react-native-screens@3.20.0 \
            react-native-storage@1.0.1 \
            react-native-svg@12.3.0 \
            react-native-video@5.2.1 \
            react-native-view-shot@3.8.0 \
            react-native-webview@13.10.5
```

### 3. 自动配置（iOS）

安装完成后，库会自动运行 `postinstall` 脚本，自动配置你的 `Podfile`。

如果自动配置失败，可以手动运行：

```bash
# 方式1：使用 npm script
npm run configure-podfile

# 方式2：使用全局命令
npx react-native-link-lib-configure

# 方式3：直接运行脚本
node node_modules/react-native-link-lib/scripts/auto-configure-podfile.js
```

### 4. 安装 iOS Pods

```bash
cd ios && pod install
```

### 5. Android 配置

Android 平台支持自动链接，通常无需额外配置。如果遇到问题，请确保：

- React Native 版本 >= 0.60
- 已运行 `npx react-native run-android`

## 自动配置说明

### 工作原理

1. **postinstall 钩子**：安装库后自动运行配置脚本
2. **智能检测**：自动检测项目结构和 Podfile 位置
3. **安全备份**：修改前自动备份原始 Podfile
4. **智能更新**：支持重复运行，会智能更新现有配置

### 配置内容

脚本会在你的 `Podfile` 中添加类似以下配置：

```ruby
# React Native Link Lib 依赖配置 - 自动生成
# 请勿手动修改此部分，运行 npx react-native-link-lib-configure 重新生成
pod 'RNCAsyncStorage', :path => '../node_modules/@react-native-async-storage/async-storage'
pod 'RNCPicker', :path => '../node_modules/@react-native-picker/picker'
pod 'FlashList', :path => '../node_modules/@shopify/flash-list'
# ... 其他依赖
# React Native Link Lib 依赖配置结束
```

## 故障排除

### 🔧 自动配置相关问题

**✅ 最新版本已解决的问题：**
- 修复了配置脚本在库项目中运行的问题
- 改进了项目根目录检测逻辑
- 增强了错误处理和用户反馈

**如果自动配置失败：**
1. **手动运行配置脚本**
   ```bash
   npx react-native-link-lib-configure
   ```

2. **查看详细日志**
   - 新版本脚本会提供详细的调试信息
   - 包括项目检测过程和错误原因

3. **确认项目结构**
   - 确保在 React Native 应用项目根目录中运行
   - 确保存在 `ios/Podfile` 或项目根目录下的 `Podfile`

### iOS 常见问题

#### 1. "Unable to find a specification" 错误

```bash
# 清理并重新安装
cd ios
rm -rf Pods Podfile.lock
pod install
```

#### 2. 路径错误

确保 `node_modules` 目录存在且包含所有依赖：

```bash
# 重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 重新配置 Podfile
npx react-native-link-lib-configure

# 重新安装 pods
cd ios && pod install
```

#### 3. 自动配置失败

如果自动配置脚本失败，可以手动添加配置到 `Podfile`：

```ruby
# 在 target 'YourApp' do 块中添加
pod 'RNCAsyncStorage', :path => '../node_modules/@react-native-async-storage/async-storage'
# ... 其他依赖（参考 example/Podfile.example）
```

### Android 常见问题

#### 1. 自动链接失败

在 `android/settings.gradle` 中手动添加：

```gradle
include ':react-native-link-lib'
project(':react-native-link-lib').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-link-lib/android')
```

在 `android/app/build.gradle` 中添加：

```gradle
dependencies {
    implementation project(':react-native-link-lib')
    // ... 其他依赖
}
```

## 验证安装

创建一个测试组件验证安装：

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { LinkLibComponent } from 'react-native-link-lib';

const TestComponent = () => {
  return (
    <View>
      <Text>React Native Link Lib 测试</Text>
      <LinkLibComponent />
    </View>
  );
};

export default TestComponent;
```

## 下一步

- 查看 [README.md](./README.md) 了解基本使用
- 查看 [API 文档](./docs/API.md) 了解详细接口
- 查看 [示例项目](./example) 了解最佳实践

## 获取帮助

如果遇到问题，请：

1. 查看本安装指南的故障排除部分
2. 查看 [GitHub Issues](https://github.com/your-repo/react-native-link-lib/issues)
3. 提交新的 Issue 并提供详细的错误信息

---

**提示**：本库采用零配置设计，大多数情况下只需要运行 `npm install` 即可完成所有配置！