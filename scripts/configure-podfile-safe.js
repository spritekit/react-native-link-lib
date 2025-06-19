#!/usr/bin/env node

/**
 * React Native Link Lib - 安全的 Podfile 配置脚本
 * 带有详细错误处理和调试信息的版本
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

function log(message, level = 'info') {
  const prefix = {
    info: '📋',
    success: '✅',
    warning: '⚠️ ',
    error: '❌'
  }[level] || '📋';
  
  console.log(`${prefix} ${message}`);
}

function findProjectRoot() {
  let currentDir = process.cwd();
  const originalDir = currentDir;
  
  log(`开始查找项目根目录，当前目录: ${currentDir}`);
  
  // 如果当前在 node_modules 中，向上查找到项目根目录
  if (currentDir.includes('node_modules')) {
    log('检测到当前在 node_modules 目录中，向上查找项目根目录');
    const nodeModulesIndex = currentDir.lastIndexOf('node_modules');
    if (nodeModulesIndex !== -1) {
      // 获取 node_modules 的父目录作为起点
      currentDir = path.dirname(currentDir.substring(0, nodeModulesIndex));
      log(`调整搜索起点到: ${currentDir}`);
    }
  }
  
  const searchedDirs = [];
  
  // 向上查找包含 package.json 的目录
  while (currentDir !== path.dirname(currentDir)) {
    searchedDirs.push(currentDir);
    const packageJsonPath = path.join(currentDir, 'package.json');
    
    log(`检查目录: ${currentDir}`);
    
    if (fs.existsSync(packageJsonPath)) {
      log(`找到 package.json: ${packageJsonPath}`);
      
      // 确保这不是 node_modules 中的 package.json
      if (!currentDir.includes('node_modules')) {
        log('确认不在 node_modules 中，验证是否为 React Native 项目');
        
        // 验证这是一个 React Native 项目
        try {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          
          // 检查是否是 react-native-link-lib 库本身
          if (packageJson.name === 'react-native-link-lib') {
            log('检测到这是 react-native-link-lib 库项目本身，跳过配置', 'warning');
            throw new Error('SKIP_LIBRARY_PROJECT');
          }
          
          const hasReactNative = 
            (packageJson.dependencies && packageJson.dependencies['react-native']) ||
            (packageJson.devDependencies && packageJson.devDependencies['react-native']) ||
            (packageJson.peerDependencies && packageJson.peerDependencies['react-native']);
          
          if (hasReactNative) {
            log(`找到 React Native 项目根目录: ${currentDir}`, 'success');
            return currentDir;
          } else {
            log('package.json 中未找到 react-native 依赖，继续查找');
          }
        } catch (e) {
          if (e.message === 'SKIP_LIBRARY_PROJECT') {
            throw e;
          }
          log(`解析 package.json 失败: ${e.message}`, 'warning');
        }
      } else {
        log('跳过 node_modules 中的 package.json');
      }
    }
    
    currentDir = path.dirname(currentDir);
  }
  
  log(`搜索的目录: ${searchedDirs.join(', ')}`, 'warning');
  throw new Error(`无法找到 React Native 项目根目录。原始目录: ${originalDir}`);
}

function findPodfilePath(projectRoot) {
  log(`在项目根目录中查找 Podfile: ${projectRoot}`);
  
  const possiblePaths = [
    path.join(projectRoot, 'ios', 'Podfile'),
    path.join(projectRoot, 'Podfile')
  ];
  
  for (const podfilePath of possiblePaths) {
    log(`检查 Podfile 路径: ${podfilePath}`);
    if (fs.existsSync(podfilePath)) {
      log(`找到 Podfile: ${podfilePath}`, 'success');
      return podfilePath;
    }
  }
  
  log(`未找到 Podfile，检查的路径: ${possiblePaths.join(', ')}`, 'warning');
  
  // 列出项目根目录的内容
  try {
    const rootContents = fs.readdirSync(projectRoot);
    log(`项目根目录内容: ${rootContents.join(', ')}`);
    
    const iosDir = path.join(projectRoot, 'ios');
    if (fs.existsSync(iosDir)) {
      const iosContents = fs.readdirSync(iosDir);
      log(`ios 目录内容: ${iosContents.join(', ')}`);
    } else {
      log('ios 目录不存在');
    }
  } catch (e) {
    log(`无法读取目录内容: ${e.message}`, 'warning');
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
  log(`开始更新 Podfile: ${podfilePath}`);
  
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
    log('更新了现有的 React Native Link Lib 配置', 'success');
  } else {
    // 添加新配置
    // 查找 target 块的结束位置
    const targetRegex = /target\s+['"][^'"]+['"]\s+do([\s\S]*?)end/;
    const match = content.match(targetRegex);
    
    if (match) {
      const insertPosition = match.index + match[0].lastIndexOf('end');
      
      const before = content.substring(0, insertPosition);
      const after = content.substring(insertPosition);
      
      content = before + '\n' + generatePodfileConfig() + '\n\n' + after;
      log('添加了 React Native Link Lib 配置到 Podfile', 'success');
    } else {
      throw new Error('无法找到 target 块，请检查 Podfile 格式');
    }
  }
  
  fs.writeFileSync(podfilePath, content, 'utf8');
}

function main() {
  try {
    log('🔧 开始自动配置 Podfile...');
    
    const projectRoot = findProjectRoot();
    log(`📁 项目根目录: ${projectRoot}`);
    
    const podfilePath = findPodfilePath(projectRoot);
    log(`📄 Podfile 路径: ${podfilePath}`);
    
    // 备份原始 Podfile
    const backupPath = podfilePath + '.backup.' + Date.now();
    fs.copyFileSync(podfilePath, backupPath);
    log(`💾 已备份原始 Podfile 到: ${backupPath}`);
    
    updatePodfile(podfilePath);
    
    log('✅ Podfile 配置完成！', 'success');
    log('🚀 现在可以运行 cd ios && pod install');
    
  } catch (error) {
    if (error.message === 'SKIP_LIBRARY_PROJECT') {
      log('ℹ️  这是 react-native-link-lib 库项目，无需配置 Podfile', 'info');
      log('📝 此脚本仅在使用该库的 React Native 应用项目中运行');
      process.exit(0);
    }
    
    log(`配置失败: ${error.message}`, 'error');
    log('💡 提示: 请确保在 React Native 项目根目录中运行此脚本');
    log('💡 或者手动运行: npx react-native-link-lib-configure');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };