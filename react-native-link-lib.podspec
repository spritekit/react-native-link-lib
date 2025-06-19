require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "react-native-link-lib"
  s.version      = package['version']
  s.homepage    = "https://github.com/author/react-native-link-lib.git"
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

  # React Native 核心依赖
  s.dependency "React-Core"
  
  # 第三方依赖 - 使用相对路径引用 node_modules 中的依赖
  # 这种方式确保 pod 能够找到本地安装的依赖包
  
  # 定义 node_modules 路径前缀
  node_modules_path = File.join(File.dirname(`node --print "require.resolve('react-native/package.json')"`), '..')
  
  # 使用路径方式声明依赖
  s.dependency 'RNCAsyncStorage', :path => File.join(node_modules_path, '@react-native-async-storage/async-storage')
  s.dependency 'RNCPicker', :path => File.join(node_modules_path, '@react-native-picker/picker')
  s.dependency 'FlashList', :path => File.join(node_modules_path, '@shopify/flash-list')
  s.dependency 'RNAudioRecorderPlayer', :path => File.join(node_modules_path, 'react-native-audio-recorder-player')
  s.dependency 'RNFastImage', :path => File.join(node_modules_path, 'react-native-fast-image')
  s.dependency 'BVLinearGradient', :path => File.join(node_modules_path, 'react-native-linear-gradient')
  s.dependency 'react-native-pager-view', :path => File.join(node_modules_path, 'react-native-pager-view')
  s.dependency 'react-native-safe-area-context', :path => File.join(node_modules_path, 'react-native-safe-area-context')
  s.dependency 'RNScreens', :path => File.join(node_modules_path, 'react-native-screens')
  s.dependency 'RNSVG', :path => File.join(node_modules_path, 'react-native-svg')
  s.dependency 'react-native-video', :path => File.join(node_modules_path, 'react-native-video')
  s.dependency 'RNViewShot', :path => File.join(node_modules_path, 'react-native-view-shot')
  s.dependency 'react-native-webview', :path => File.join(node_modules_path, 'react-native-webview')

end