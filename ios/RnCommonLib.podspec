require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "RnCommonLib"
  s.version      = package['version']
  s.summary      = package['description']
  s.description  = <<-DESC
                  A library to manage React Native dependencies and native configurations
                   DESC
  s.homepage     = ""
  s.license      = "MIT"
  s.author       = { "author" => "" }
  s.platforms    = { :ios => "11.0" }
  s.source       = { :git => "https://github.com/author/react-native-link-lib.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"
  s.requires_arc = true
  # 依赖
  s.dependency "React-Core"

  # 第三方库
  # react-native-video
  s.dependency "react-native-video", "~> 5.2.1"

end