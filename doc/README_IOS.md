# React Native Link Lib - iOS集成指南

## 概述

本库为React Native项目提供了16个常用第三方库的iOS端配置，支持CocoaPods集成。

## 包含的库

- **@react-native-async-storage/async-storage** - 本地存储
- **@react-native-picker/picker** - 选择器组件
- **@shopify/flash-list** - 高性能列表组件
- **react-native-audio-recorder-player** - 音频录制播放
- **react-native-fast-image** - 高性能图片组件
- **react-native-linear-gradient** - 线性渐变
- **react-native-pager-view** - 页面滑动组件
- **react-native-popover-view** - 弹出视图
- **react-native-safe-area-context** - 安全区域
- **react-native-screens** - 屏幕导航优化
- **react-native-svg** - SVG支持
- **react-native-update** - 热更新
- **react-native-video** - 视频播放
- **react-native-view-shot** - 截图功能
- **react-native-webview** - WebView组件

## iOS集成步骤

### 方法一：使用本库的podspec（推荐）

在你的主项目的 `ios/Podfile` 中添加：

```ruby
# 引入react-native-link-lib（已包含版本约束，确保与package.json一致）
pod 'RnCommonLib', :path => '../node_modules/react-native-link-lib'
```

然后执行：

```bash
cd ios && pod install
```

**注意**：本库的podspec已配置了与package.json一致的版本约束（使用 `~>` 语义化版本），确保版本兼容性和构建稳定性。

### 方法二：直接引用各个库（手动配置）

如果你需要更精细的控制，可以在 `ios/Podfile` 中直接添加各个库：

```ruby
# 定义node_modules路径
prefix = 'react-native/node_modules'

# React Native第三方库
pod 'RNCAsyncStorage', :path => "#{prefix}/@react-native-async-storage/async-storage"
pod 'RNCPicker', :path => "#{prefix}/@react-native-picker/picker"
pod 'RNFlashList', :path => "#{prefix}/@shopify/flash-list"
pod 'RNAudioRecorderPlayer', :path => "#{prefix}/react-native-audio-recorder-player"
pod 'RNFastImage', :path => "#{prefix}/react-native-fast-image"
pod 'BVLinearGradient', :path => "#{prefix}/react-native-linear-gradient"
pod 'react-native-pager-view', :path => "#{prefix}/react-native-pager-view"
pod 'react-native-popover-view', :path => "#{prefix}/react-native-popover-view"
pod 'react-native-safe-area-context', :path => "#{prefix}/react-native-safe-area-context"
pod 'RNScreens', :path => "#{prefix}/react-native-screens"
pod 'RNSVG', :path => "#{prefix}/react-native-svg"
pod 'react-native-update', :path => "#{prefix}/react-native-update"
pod 'react-native-video', :path => "#{prefix}/react-native-video"
pod 'react-native-view-shot', :path => "#{prefix}/react-native-view-shot"
pod 'react-native-webview', :path => "#{prefix}/react-native-webview"
```

## Pod名称对照表

| npm包名 | Pod名称 | 说明 |
|---------|---------|------|
| @react-native-async-storage/async-storage | RNCAsyncStorage | 本地存储 |
| @react-native-picker/picker | RNCPicker | 选择器 |
| @shopify/flash-list | RNFlashList | 高性能列表 |
| react-native-audio-recorder-player | RNAudioRecorderPlayer | 音频录制播放 |
| react-native-fast-image | RNFastImage | 高性能图片 |
| react-native-linear-gradient | BVLinearGradient | 线性渐变 |
| react-native-pager-view | react-native-pager-view | 页面滑动 |
| react-native-popover-view | react-native-popover-view | 弹出视图 |
| react-native-safe-area-context | react-native-safe-area-context | 安全区域 |
| react-native-screens | RNScreens | 屏幕优化 |
| react-native-svg | RNSVG | SVG支持 |
| react-native-update | react-native-update | 热更新 |
| react-native-video | react-native-video | 视频播放 |
| react-native-view-shot | react-native-view-shot | 截图功能 |
| react-native-webview | react-native-webview | WebView |

## 权限配置

### Info.plist权限

根据使用的功能，在 `ios/YourApp/Info.plist` 中添加相应权限：

```xml
<!-- 相机权限 -->
<key>NSCameraUsageDescription</key>
<string>此应用需要访问相机来拍照</string>

<!-- 麦克风权限 -->
<key>NSMicrophoneUsageDescription</key>
<string>此应用需要访问麦克风来录音</string>

<!-- 照片库权限 -->
<key>NSPhotoLibraryUsageDescription</key>
<string>此应用需要访问照片库来选择图片</string>

<!-- 文件访问权限 -->
<key>NSDocumentsFolderUsageDescription</key>
<string>此应用需要访问文档文件夹</string>

<!-- 网络权限（iOS 9+默认需要HTTPS） -->
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

## 版本要求

- **iOS**: >= 11.0
- **Xcode**: >= 12.0
- **CocoaPods**: >= 1.10.0
- **React Native**: >= 0.60.0

## 构建配置

### Xcode项目设置

1. **最低部署目标**: iOS 11.0
2. **架构支持**: arm64, x86_64
3. **Bitcode**: 建议禁用（某些库不支持）

### 性能优化

在 `ios/Podfile` 中添加以下配置：

```ruby
# 优化编译速度
install! 'cocoapods', :deterministic_uuids => false

# 禁用Bitcode（如果遇到问题）
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['ENABLE_BITCODE'] = 'NO'
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '11.0'
    end
  end
end
```

## 常见问题

### 1. Pod install失败

```bash
# 清理CocoaPods缓存
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod setup
pod install
```

### 2. 编译错误

- 确保Xcode版本兼容
- 检查iOS部署目标设置
- 验证Pod名称是否正确

### 3. 运行时错误

- 检查Info.plist权限配置
- 确认所有库都已正确链接
- 查看Xcode控制台错误信息

### 4. 架构问题

如果遇到架构相关问题，在Podfile中添加：

```ruby
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['EXCLUDED_ARCHS[sdk=iphonesimulator*]'] = 'arm64'
    end
  end
end
```

## 清理命令

```bash
# 清理iOS构建
cd ios
xcodebuild clean
rm -rf build
rm -rf Pods Podfile.lock
pod install

# 清理React Native缓存
cd ..
npx react-native start --reset-cache
```

## 技术支持

如果遇到问题，请按以下顺序检查：

1. 确认React Native版本兼容性
2. 检查Pod名称是否正确
3. 验证权限配置是否完整
4. 查看Xcode编译错误信息
5. 尝试清理缓存重新构建

## 更新日志

- **v1.0.0**: 初始版本，包含16个常用React Native库的iOS配置
- **v1.0.1**: 修正Pod名称，确保与实际pod配置一致