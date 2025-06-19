
# RN 通用库

一个自动管理React Native依赖和原生配置的库。

## 功能特性

- 自动配置Android和iOS的原生依赖
- 通过package.json管理第三方库
- 无需手动修改原生代码
- 提供配置验证功能

## 安装

```bash
yarn add react-native-link-lib
# 或
npm install react-native-link-lib
```

## 使用方法

1. 在项目的package.json中添加依赖:
```json
{
  "dependencies": {
    "react-native-video": "^5.2.1"
  }
}
```

2. 使用VideoConfigValidator验证配置:
```javascript
import { VideoConfigValidator } from 'react-native-link-lib';

/**
 * 视频配置对象示例:
 * {
 *   source: {
 *     uri: '视频URI', // 必填
 *     type?: 'mp4' | 'm3u8' // 可选
 *   },
 *   controls?: boolean, // 是否显示控制条
 *   autoplay?: boolean, // 是否自动播放
 *   muted?: boolean    // 是否静音
 * }
 */
const isValidAndroid = VideoConfigValidator.validateAndroidConfig(videoConfig);
const isValidIOS = VideoConfigValidator.validateIOSConfig(videoConfig);

if (!isValidAndroid || !isValidIOS) {
  console.error('视频配置验证失败');
}
```
```

## Android配置

无需额外配置。本库会自动:
- 添加所需的Gradle依赖
- 配置Android项目设置
- 包含react-native-video依赖

## iOS配置

添加库后，在ios目录运行`pod install`。

本库会自动:
- 添加所需的Pod依赖
- 配置iOS项目设置
- 包含react-native-video依赖

## 支持的库

目前支持:
- react-native-video

未来版本将添加更多库支持。