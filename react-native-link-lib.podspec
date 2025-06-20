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
  s.dependency 'React-Core'
  s.dependency 'SDWebImage', '~> 5.11.1'
  s.dependency 'SDWebImageWebPCoder', '~> 0.8.4'
  # 使用路径方式声明依赖
  prefix = 'react-native/node_modules'
  s.dependency 'RNCAsyncStorage', {:path => "#{prefix}/@react-native-async-storage/async-storage"}
  s.dependency 'RNFastImage', :path => "#{prefix}/react-native-fast-image"


end