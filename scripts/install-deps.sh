#!/bin/bash

# React Native Link Lib - 依赖安装脚本
# 自动安装所有 peer dependencies

echo "🚀 开始安装 React Native Link Lib 依赖..."

# 检查包管理器
if command -v yarn &> /dev/null; then
    PACKAGE_MANAGER="yarn"
    ADD_CMD="yarn add"
elif command -v pnpm &> /dev/null; then
    PACKAGE_MANAGER="pnpm"
    ADD_CMD="pnpm add"
else
    PACKAGE_MANAGER="npm"
    ADD_CMD="npm install"
fi

echo "📦 使用 $PACKAGE_MANAGER 安装依赖..."

# 安装主库
echo "📥 安装主库..."
$ADD_CMD react-native-link-lib

# 安装 peer dependencies
echo "📥 安装 peer dependencies..."
$ADD_CMD @react-native-async-storage/async-storage@1.23.1 \
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

echo "✅ React Native Link Lib 依赖安装完成！"
echo "🔧 正在自动配置 Podfile..."

# 运行自动配置脚本
if [ -f "node_modules/react-native-link-lib/scripts/auto-configure-podfile.js" ]; then
    node node_modules/react-native-link-lib/scripts/auto-configure-podfile.js
else
    echo "⚠️  自动配置脚本未找到，请手动运行: npx react-native-link-lib-configure"
fi

echo "📖 请查看 README.md 了解更多使用说明"
echo "🚀 现在可以运行: cd ios && pod install"