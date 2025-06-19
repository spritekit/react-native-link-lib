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
  
  # 第三方依赖 - 对应 package.json 中的 peerDependencies
  s.dependency "RNCAsyncStorage"
  s.dependency "RNCPicker"
  s.dependency "FlashList"
  s.dependency "RNAudioRecorderPlayer"
  s.dependency "RNFastImage"
  s.dependency "BVLinearGradient"
  s.dependency "react-native-pager-view"
  s.dependency "react-native-safe-area-context"
  s.dependency "RNScreens"
  s.dependency "RNSVG"
  s.dependency "react-native-video"
  s.dependency "RNViewShot"
  s.dependency "react-native-webview"

end