# React Native Link Lib - 安装配置指南

## 概述

本库集成了16个常用的React Native第三方库，提供完整的Android和iOS配置，开箱即用。

## 包含的库列表

1. **@react-native-async-storage/async-storage** - 本地异步存储
2. **@react-native-picker/picker** - 原生选择器组件
3. **@shopify/flash-list** - 高性能列表组件
4. **react-native-audio-recorder-player** - 音频录制和播放
5. **react-native-fast-image** - 高性能图片加载
6. **react-native-fs** - 文件系统操作
7. **react-native-linear-gradient** - 线性渐变组件
8. **react-native-pager-view** - 页面滑动视图
9. **react-native-popover-view** - 弹出视图组件
10. **react-native-safe-area-context** - 安全区域上下文
11. **react-native-screens** - 屏幕导航优化
12. **react-native-svg** - SVG图形支持
13. **react-native-update** - 应用热更新
14. **react-native-video** - 视频播放组件
15. **react-native-view-shot** - 视图截图功能
16. **react-native-webview** - WebView组件

## 安装步骤

### 1. NPM/Yarn安装

```bash
# 使用npm
npm install react-native-link-lib

# 或使用yarn
yarn add react-native-link-lib
```

### 2. iOS配置

```bash
cd ios && pod install
```

### 3. Android配置

所有Android配置文件已自动创建，无需手动配置。

## Android配置文件

以下Android配置文件已自动创建和配置：

### 1. settings.gradle
- 配置了所有React Native库的模块依赖
- 包含正确的项目路径映射

### 2. MainApplication.java
- 注册了所有必需的React Native包
- 包含完整的import语句

### 3. AndroidManifest.xml
- 添加了所有必需的权限
- 配置了网络安全和文件提供者

### 4. proguard-rules.pro
- 完整的混淆规则配置
- 保护所有React Native库不被混淆
- 包含性能优化规则

### 5. gradle.properties
- Android构建优化配置
- AndroidX和R8支持
- 内存和性能优化设置

### 6. gradle/wrapper/gradle-wrapper.properties
- Gradle Wrapper版本配置
- 确保构建环境一致性

### 7. README_ANDROID.md
- 详细的Android集成指南
- 包含完整的配置步骤和故障排除

## iOS配置文件

### RnCommonLib.podspec
- 配置了所有React Native库的iOS依赖
- 包含正确的版本约束和依赖关系

## 权限配置

### Android权限

以下权限已在AndroidManifest.xml中配置：

- `INTERNET` - 网络访问
- `ACCESS_NETWORK_STATE` - 网络状态
- `READ_EXTERNAL_STORAGE` - 读取外部存储
- `WRITE_EXTERNAL_STORAGE` - 写入外部存储
- `RECORD_AUDIO` - 音频录制
- `MODIFY_AUDIO_SETTINGS` - 音频设置
- `CAMERA` - 相机访问
- `VIBRATE` - 震动
- `WAKE_LOCK` - 唤醒锁
- `SYSTEM_ALERT_WINDOW` - 系统弹窗
- `FOREGROUND_SERVICE` - 前台服务
- `POST_NOTIFICATIONS` - 通知权限

### iOS权限

需要在Info.plist中添加相应的权限描述。

## 使用示例

### AsyncStorage

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// 存储数据
const storeData = async (value: string) => {
  try {
    await AsyncStorage.setItem('@storage_Key', value);
  } catch (e) {
    // 保存错误
  }
};

// 读取数据
const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('@storage_Key');
    if(value !== null) {
      return value;
    }
  } catch(e) {
    // 读取错误
  }
};
```

### FlashList

```typescript
import { FlashList } from '@shopify/flash-list';

const MyList = () => {
  const data = [{title: "First Item"}, {title: "Second Item"}];
  
  return (
    <FlashList
      data={data}
      renderItem={({ item }) => <Text>{item.title}</Text>}
      estimatedItemSize={200}
    />
  );
};
```

### FastImage

```typescript
import FastImage from 'react-native-fast-image';

const MyImage = () => (
  <FastImage
    style={{ width: 200, height: 200 }}
    source={{
      uri: 'https://unsplash.it/400/400?image=1',
      priority: FastImage.priority.normal,
    }}
    resizeMode={FastImage.resizeMode.contain}
  />
);
```

## 重要注意事项

1. **React Native版本**: 需要React Native 0.60+
2. **自动链接**: 支持React Native自动链接
3. **手动链接**: 如需手动链接，请参考各库的官方文档
4. **版本兼容性**: 所有库版本都经过兼容性测试

## 故障排除

### 常见问题

1. **编译错误**: 确保React Native版本兼容
2. **链接问题**: 清理缓存后重新构建
3. **权限问题**: 检查AndroidManifest.xml和Info.plist配置

### 清理命令

```bash
# 清理React Native缓存
npx react-native start --reset-cache

# 清理Android构建
cd android && ./gradlew clean

# 清理iOS构建
cd ios && xcodebuild clean
```

## 版本要求

- **React Native**: >= 0.60.0
- **Android**: API Level 21+ (Android 5.0+)
- **iOS**: >= 10.0
- **Node.js**: >= 12.0

## 更新日志

### v1.0.0 (当前版本)
- 初始发布
- 包含16个React Native库的完整配置
- 提供Android和iOS的开箱即用支持
- 包含完整的权限配置和混淆规则
- 添加详细的集成指南和故障排除文档

## 技术支持

如遇到问题，请按以下顺序检查：

1. 确认React Native版本兼容性
2. 检查Android/iOS配置是否正确
3. 验证权限配置是否完整
4. 查看混淆规则是否正确
5. 尝试清理缓存重新构建

更多详细信息请参考 `README_ANDROID.md` 文件。