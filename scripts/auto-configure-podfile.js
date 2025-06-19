#!/usr/bin/env node

/**
 * React Native Link Lib - 自动配置 Podfile 脚本
 * 自动在用户项目的 Podfile 中添加必要的依赖配置
 */

const fs = require('fs');
const path = require('path');

// 依赖映射表
const DEPENDENCIES = {
  'RNCAsyncStorage': '@react-native-async-storage/async-storage',
  'RNCPicker': '@react-native-picker/picker',
  'FlashList': '@shopify/flash-list',
  'RNAudioRecorderPlayer': 'react-native-audio-recorder-player',
  'RNFastImage': 'react-native-fast-image',
  'BVLinearGradient': 'react-native-linear-gradient',
  'react-native-pager-view': 'react-native-pager-view',
  'react-native-safe-area-context': 'react-native-safe-area-context',
  'RNScreens': 'react-native-screens',
  'RNSVG': 'react-native-svg',
  'react-native-video': 'react-native-video',
  'RNViewShot': 'react-native-view-shot',
  'react-native-webview': 'react-native-webview'
};

function findProjectRoot() {
  let currentDir = process.cwd();
  
  while (currentDir !== path.dirname(currentDir)) {
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  
  throw new Error('无法找到项目根目录（package.json）');
}

function findPodfilePath(projectRoot) {
  const iosPodfile = path.join(projectRoot, 'ios', 'Podfile');
  const rootPodfile = path.join(projectRoot, 'Podfile');
  
  if (fs.existsSync(iosPodfile)) {
    return iosPodfile;
  } else if (fs.existsSync(rootPodfile)) {
    return rootPodfile;
  }
  
  throw new Error('无法找到 Podfile 文件');
}

function generatePodfileConfig() {
  const configs = [];
  
  configs.push('  # React Native Link Lib 依赖配置 - 自动生成');
  configs.push('  # 请勿手动修改此部分，运行 npx react-native-link-lib-configure 重新生成');
  
  Object.entries(DEPENDENCIES).forEach(([podName, npmPackage]) => {
    configs.push(`  pod '${podName}', :path => '../node_modules/${npmPackage}'`);
  });
  
  configs.push('  # React Native Link Lib 依赖配置结束');
  
  return configs.join('\n');
}

function updatePodfile(podfilePath) {
  let content = fs.readFileSync(podfilePath, 'utf8');
  
  // 检查是否已经存在配置
  const startMarker = '# React Native Link Lib 依赖配置 - 自动生成';
  const endMarker = '# React Native Link Lib 依赖配置结束';
  
  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);
  
  if (startIndex !== -1 && endIndex !== -1) {
    // 替换现有配置
    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex + endMarker.length);
    content = before + generatePodfileConfig() + after;
    console.log('✅ 更新了现有的 React Native Link Lib 配置');
  } else {
    // 添加新配置
    // 查找 target 块的结束位置
    const targetRegex = /target\s+['"][^'"]+['"]\s+do([\s\S]*?)end/;
    const match = content.match(targetRegex);
    
    if (match) {
      const targetContent = match[1];
      const insertPosition = match.index + match[0].lastIndexOf('end');
      
      const before = content.substring(0, insertPosition);
      const after = content.substring(insertPosition);
      
      content = before + '\n' + generatePodfileConfig() + '\n\n' + after;
      console.log('✅ 添加了 React Native Link Lib 配置到 Podfile');
    } else {
      throw new Error('无法找到 target 块，请检查 Podfile 格式');
    }
  }
  
  fs.writeFileSync(podfilePath, content, 'utf8');
}

function main() {
  try {
    console.log('🔧 开始自动配置 Podfile...');
    
    const projectRoot = findProjectRoot();
    console.log(`📁 项目根目录: ${projectRoot}`);
    
    const podfilePath = findPodfilePath(projectRoot);
    console.log(`📄 Podfile 路径: ${podfilePath}`);
    
    // 备份原始 Podfile
    const backupPath = podfilePath + '.backup.' + Date.now();
    fs.copyFileSync(podfilePath, backupPath);
    console.log(`💾 已备份原始 Podfile 到: ${backupPath}`);
    
    updatePodfile(podfilePath);
    
    console.log('✅ Podfile 配置完成！');
    console.log('🚀 现在可以运行 cd ios && pod install');
    
  } catch (error) {
    console.error('❌ 配置失败:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };