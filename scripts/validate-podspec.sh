#!/bin/bash

# 验证 podspec 文件和依赖配置的脚本
# 使用方法: ./scripts/validate-podspec.sh

set -e

echo "🔍 验证 react-native-link-lib podspec 配置..."
echo ""

# 检查 podspec 文件语法
echo "📋 检查 podspec 文件语法..."
if pod spec lint react-native-link-lib.podspec --allow-warnings --quick; then
    echo "✅ podspec 文件语法正确"
else
    echo "❌ podspec 文件语法有误，请检查文件内容"
    exit 1
fi

echo ""

# 检查 node_modules 中的依赖
echo "📦 检查 peerDependencies 是否已安装..."

dependencies=(
    "@react-native-async-storage/async-storage"
    "@react-native-picker/picker"
    "@shopify/flash-list"
    "react-native-audio-recorder-player"
    "react-native-fast-image"
    "react-native-linear-gradient"
    "react-native-pager-view"
    "react-native-safe-area-context"
    "react-native-screens"
    "react-native-svg"
    "react-native-video"
    "react-native-view-shot"
    "react-native-webview"
)

missing_deps=()

for dep in "${dependencies[@]}"; do
    if [ -d "node_modules/$dep" ]; then
        echo "✅ $dep"
    else
        echo "❌ $dep (未安装)"
        missing_deps+=("$dep")
    fi
done

echo ""

if [ ${#missing_deps[@]} -gt 0 ]; then
    echo "⚠️  发现缺失的依赖，请安装以下包："
    for dep in "${missing_deps[@]}"; do
        echo "   npm install $dep"
    done
    echo ""
else
    echo "✅ 所有 peerDependencies 都已正确安装"
fi

# 检查 CocoaPods 版本
echo "🔧 检查 CocoaPods 版本..."
if command -v pod >/dev/null 2>&1; then
    pod_version=$(pod --version)
    echo "CocoaPods 版本: $pod_version"
    
    # 检查版本是否足够新 (>= 1.11.0)
    if [[ "$pod_version" < "1.11.0" ]]; then
        echo "⚠️  建议升级 CocoaPods 到 1.11.0 或更高版本"
        echo "   gem update cocoapods"
    else
        echo "✅ CocoaPods 版本符合要求"
    fi
else
    echo "❌ 未找到 CocoaPods，请先安装 CocoaPods"
fi

echo ""
echo "🎉 验证完成！"
echo ""
echo "💡 如果仍然遇到 pod install 问题，请尝试："
echo "   1. pod repo update"
echo "   2. cd ios && rm -rf Pods/ Podfile.lock && pod install --repo-update"
echo "   3. 检查各依赖的版本兼容性"