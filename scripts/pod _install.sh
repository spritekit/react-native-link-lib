#!/bin/bash
# 安装React Native依赖
prefix="${PODS_ROOT}/.."

echo "开始安装React Native依赖..."

cat > Podfile <<EOL
platform :ios, '11.0'

use_frameworks!

target 'react-native-link-lib' do
  pod 'BVLinearGradient', :path => "#{prefix}/react-native-linear-gradient"
  pod 'RNSVG', :path => "#{prefix}/react-native-svg"
  pod 'react-native-view-shot', :path => "#{prefix}/react-native-view-shot"
  pod 'react-native-webview', :path => "#{prefix}/react-native-webview"
  pod 'RNCPicker', :path => "#{prefix}/@react-native-picker/picker"
  pod 'RNCAsyncStorage', :path => "#{prefix}/@react-native-async-storage/async-storage"
  pod 'react-native-video', :path => "#{prefix}/react-native-video"
  pod 'react-native-pager-view', :path => "#{prefix}/react-native-pager-view"
  pod 'RNFastImage', :path => "#{prefix}/react-native-fast-image"
  pod 'RNFlashList', :path => "#{prefix}/@shopify/flash-list"
  pod 'RNAudioRecorderPlayer', :path => "#{prefix}/react-native-audio-recorder-player"
  pod 'react-native-tim-js', :path => "#{prefix}/@tencentcloud/chat-react-native"
end
EOL

pod install
echo "依赖安装完成"