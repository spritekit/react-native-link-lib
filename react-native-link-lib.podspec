require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "react-native-link-lib"
  s.version      = package['version']
  s.homepage         = 'https://github.com/your-org/react-native-link-lib'
  s.summary          = 'A React Native library for linking common dependencies'
  s.description      = 'This library provides a centralized way to manage and link common React Native dependencies in a hybrid app environment.'
  s.license      = "MIT"
  s.author       = { "author" => "" }
  s.platforms    = { :ios => "11.0" }
  s.source       = { :git => "https://github.com/author/react-native-link-lib.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"
  s.requires_arc = true
  # 依赖
  s.dependency "React-Core"

  # React Native 第三方库 - 与package.json版本保持一致
  prefix = File.dirname(__FILE__) + '/../node_modules'
  pod 'RNScreens', :path => "#{prefix}/react-native-screens"
  pod 'react-native-safe-area-context', :path => "#{prefix}/react-native-safe-area-context"
  pod 'RNFS', :path => "#{prefix}/react-native-fs"
  pod 'BVLinearGradient', :path => "#{prefix}/react-native-linear-gradient"
  pod 'RNSVG', :path => "#{prefix}/react-native-svg"
  pod 'react-native-view-shot', :path => "#{prefix}/react-native-view-shot"
  pod 'react-native-webview', :path => "#{prefix}/react-native-webview"
  pod 'RNCPicker', :path => "#{prefix}/@react-native-picker/picker"
  pod 'react-native-update', :path => "#{prefix}/react-native-update"
  pod 'RNCAsyncStorage', :path => "#{prefix}/@react-native-async-storage/async-storage"
  pod 'react-native-video', :path => "#{prefix}/react-native-video"
  pod 'react-native-pager-view', :path => "#{prefix}/react-native-pager-view"
  pod 'RNFastImage', :path => "#{prefix}/react-native-fast-image"
  pod 'RNFlashList', :path => "#{prefix}/@shopify/flash-list"
  pod 'RNAudioRecorderPlayer', :path => "#{prefix}/react-native-audio-recorder-player"
  pod 'react-native-tim-js', :path => "#{prefix}/@tencentcloud/chat-react-native"


end