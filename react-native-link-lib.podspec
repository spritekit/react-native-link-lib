require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "react-native-link-lib"
  s.version      = package['version']
  s.homepage    = "https://github.com/your-org/react-native-link-lib"
  s.summary     = "React Native Link Library provides common linking functionality"
  s.description  = <<-DESC
                  A React Native library that provides common linking functionality for iOS and Android platforms. Includes features like deep linking, universal links and URL handling.
                   DESC
  s.license      = "MIT"
  s.author       = { "author" => "" }
  s.platforms    = { :ios => "11.0" }
  s.source       = { :git => "https://github.com/author/react-native-link-lib.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"
  s.requires_arc = true
  # 依赖
  s.dependency "React-Core"

  # React Native 第三方库 - 与package.json版本保持一致
  # prefix = 'react-native/node_modules'
  # s.dependency 'RNScreens', :path => "#{prefix}/react-native-screens"
  # s.dependency 'react-native-safe-area-context', :path => "#{prefix}/react-native-safe-area-context"
  # s.dependency 'RNFS', :path => "#{prefix}/react-native-fs"
  # s.dependency 'BVLinearGradient', :path => "#{prefix}/react-native-linear-gradient"
  # s.dependency 'RNSVG', :path => "#{prefix}/react-native-svg"
  # s.dependency 'react-native-view-shot', :path => "#{prefix}/react-native-view-shot"
  # s.dependency 'react-native-webview', :path => "#{prefix}/react-native-webview"
  # s.dependency 'RNCPicker', :path => "#{prefix}/@react-native-picker/picker"
  # s.dependency 'react-native-update', :path => "#{prefix}/react-native-update"
  # s.dependency 'RNCAsyncStorage', :path => "#{prefix}/@react-native-async-storage/async-storage"
  # s.dependency 'react-native-video', :path => "#{prefix}/react-native-video"
  # s.dependency 'react-native-pager-view', :path => "#{prefix}/react-native-pager-view"
  # s.dependency 'RNFastImage', :path => "#{prefix}/react-native-fast-image"
  # s.dependency 'RNFlashList', :path => "#{prefix}/@shopify/flash-list"
  # s.dependency 'RNAudioRecorderPlayer', :path => "#{prefix}/react-native-audio-recorder-player"


end