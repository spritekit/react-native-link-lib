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
  s.dependency "RNCAsyncStorage", "1.23.1"
  s.dependency "RNCPicker", "2.7.7"
  s.dependency "RNFlashList", "1.7.3"
  s.dependency "RNAudioRecorderPlayer", "3.6.12"
  s.dependency "RNFastImage", "8.6.3"
  s.dependency "RNFS", "2.20.0"
  s.dependency "BVLinearGradient", "2.8.3"
  s.dependency "react-native-pager-view", "6.6.1"
  s.dependency "react-native-popover-view", "6.1.0"
  s.dependency "react-native-safe-area-context", "4.5.0"
  s.dependency "RNScreens", "3.20.0"
  s.dependency "RNSVG", "12.3.0"
  s.dependency "react-native-update", "10.18.0"
  s.dependency "react-native-video", "5.2.1"
  s.dependency "react-native-view-shot", "3.8.0"
  s.dependency "react-native-webview", "13.10.5"

end