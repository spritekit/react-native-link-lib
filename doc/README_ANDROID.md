# React Native Link Lib - Android集成指南

## 概述

本库为React Native项目提供了16个常用第三方库的Android端配置，开箱即用。

## 包含的库

- **@react-native-async-storage/async-storage** - 本地存储
- **@react-native-picker/picker** - 选择器组件
- **@shopify/flash-list** - 高性能列表组件
- **react-native-audio-recorder-player** - 音频录制播放
- **react-native-fast-image** - 高性能图片组件
- **react-native-fs** - 文件系统操作
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

## Android集成步骤

### 1. 添加依赖

在你的主项目的 `android/settings.gradle` 中添加：

```gradle
// 引入react-native-link-lib
include ':react-native-link-lib'
project(':react-native-link-lib').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-link-lib/android')
```

### 2. 在主项目的 `android/app/build.gradle` 中添加依赖：

```gradle
dependencies {
    implementation project(':react-native-link-lib')
    // ... 其他依赖
}
```

### 3. 在 `MainApplication.java` 中注册包：

```java
import com.reactnativelinklib.ReactNativeLinkLibPackage;

public class MainApplication extends Application implements ReactApplication {
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new ReactNativeLinkLibPackage() // 添加这行
        );
    }
}
```

### 4. 权限配置

在你的主项目的 `android/app/src/main/AndroidManifest.xml` 中添加必要权限：

```xml
<!-- 网络权限 -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- 存储权限 -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

<!-- 音频权限 -->
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />

<!-- 相机权限 -->
<uses-permission android:name="android.permission.CAMERA" />

<!-- 其他权限 -->
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
```

### 5. 网络安全配置（可选）

如果使用FastImage等需要网络图片的组件，在 `android/app/src/main/res/xml/` 目录下创建 `network_security_config.xml`：

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
        <domain includeSubdomains="true">10.0.3.2</domain>
    </domain-config>
</network-security-config>
```

然后在 `AndroidManifest.xml` 的 `<application>` 标签中添加：

```xml
<application
    android:networkSecurityConfig="@xml/network_security_config"
    ...>
```

## 版本要求

- **Android API Level**: 最低21 (Android 5.0)
- **Gradle**: 7.3.3+
- **Android Gradle Plugin**: 7.0.4+
- **React Native**: 0.60+

## 构建配置

### ProGuard/R8混淆

本库已包含完整的混淆规则，无需额外配置。如果遇到混淆问题，可以参考 `android/proguard-rules.pro` 文件。

### 性能优化

建议在主项目的 `android/gradle.properties` 中添加以下配置：

```properties
# 启用AndroidX
android.useAndroidX=true
android.enableJetifier=true

# 启用R8
android.enableR8=true

# 构建性能优化
org.gradle.jvmargs=-Xmx4g
org.gradle.parallel=true
org.gradle.daemon=true
org.gradle.caching=true
```

## 常见问题

### 1. 编译错误

如果遇到编译错误，请确保：
- React Native版本 >= 0.60
- 已正确配置AndroidX
- Gradle版本兼容

### 2. 运行时错误

如果遇到运行时错误：
- 检查权限配置是否完整
- 确认所有包都已正确注册
- 查看混淆规则是否正确

### 3. 清理缓存

如果遇到奇怪的问题，尝试清理缓存：

```bash
cd android
./gradlew clean
cd ..
npx react-native start --reset-cache
```

## 技术支持

如果遇到问题，请检查：
1. React Native版本兼容性
2. Android配置是否正确
3. 权限是否完整
4. 混淆规则是否正确

## 更新日志

- **v1.0.0**: 初始版本，包含16个常用React Native库的Android配置