/**
 * Copyright © 2020-2025 Ocean Galaxy Inc. All Rights Reserved.
 * @Description: iOS Podfile自动配置脚本 - 扫描依赖并生成Pod配置
 * @LastEditors: yingongjing
 * @LastEditTime: 2025-06-20 11:01:52
 */
const fs = require('fs');
const path = require('path');

/**
 * 递归向上查找Podfile文件
 * @param {string} startPath - 开始查找的路径
 * @returns {string|null} - 找到的Podfile路径或null
 */
function findPodfile(startPath) {
  let currentPath = path.resolve(startPath);
  
  while (currentPath !== path.dirname(currentPath)) {
    const podfilePath = path.join(currentPath, 'Podfile');
    
    if (fs.existsSync(podfilePath)) {
      return podfilePath;
    }
    
    // 向上一级目录
    currentPath = path.dirname(currentPath);
  }
  
  return null;
}

/**
 * 从package.json获取依赖列表
 * @param {string} packageJsonPath - package.json文件路径
 * @returns {string[]} - 依赖包名列表
 */
function getDependenciesFromPackageJson(packageJsonPath) {
  if (!fs.existsSync(packageJsonPath)) {
    console.log('未找到package.json文件');
    return [];
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.peerDependencies,
    ...packageJson.devDependencies
  };
  
  return Object.keys(dependencies).filter(dep => dep.startsWith('react-native') || dep.startsWith('@react-native') || dep.startsWith('@shopify'));
}

/**
 * 扫描node_modules中的podspec文件
 * @param {string} nodeModulesPath - node_modules路径
 * @param {string[]} dependencies - 依赖包名列表
 * @returns {Object} - Pod名称到包路径的映射
 */
function scanPodspecFiles(nodeModulesPath, dependencies) {
  const podConfigs = {};
  
  dependencies.forEach(dep => {
    const depPath = path.join(nodeModulesPath, dep);
    
    if (!fs.existsSync(depPath)) {
      console.log(`依赖包不存在: ${dep}`);
      return;
    }
    
    // 查找.podspec文件
    const files = fs.readdirSync(depPath);
    const podspecFile = files.find(file => file.endsWith('.podspec'));
    
    if (podspecFile) {
      const podspecPath = path.join(depPath, podspecFile);
      const podspecContent = fs.readFileSync(podspecPath, 'utf8');
      
      // 从podspec文件中提取Pod名称
      const nameMatch = podspecContent.match(/s\.name\s*=\s*['"]([\^'"]+)['"]/)
        || podspecContent.match(/Pod::Spec\.new\s*do\s*\|s\|[\s\S]*?s\.name\s*=\s*['"]([\^'"]+)['"]/)
        || podspecContent.match(/spec\.name\s*=\s*['"]([\^'"]+)['"]/)
        || podspecContent.match(/name:\s*['"]([\^'"]+)['"]/)
        || podspecContent.match(/name\s*=\s*['"]([\^'"]+)['"]/)
        || podspecContent.match(/^\s*['"]([\^'"]+)['"]/);      
      
      if (nameMatch) {
        const podName = nameMatch[1];
        podConfigs[podName] = dep;
        console.log(`发现Pod配置: ${podName} -> ${dep}`);
      } else {
        console.log(`无法从${podspecFile}中提取Pod名称`);
      }
    }
  });
  
  return podConfigs;
}

/**
 * 获取主项目的peerDependencies
 * @returns {string[]} - peerDependencies列表
 */
function getMainProjectPeerDependencies() {
  // 查找主项目的package.json（react-native-link-lib项目）
  let currentPath = path.resolve(__dirname);
  
  // 向上查找到主项目根目录
  while (currentPath !== path.dirname(currentPath)) {
    const testPackageJson = path.join(currentPath, 'package.json');
    
    if (fs.existsSync(testPackageJson)) {
      const packageJson = JSON.parse(fs.readFileSync(testPackageJson, 'utf8'));
      
      // 检查是否是主项目（react-native-link-lib）
      if (packageJson.name === 'react-native-link-lib' && packageJson.peerDependencies) {
        console.log(`找到主项目配置: ${testPackageJson}`);
        return Object.keys(packageJson.peerDependencies).filter(dep => 
          // 过滤掉 react-native 官方库
          (dep !== 'react-native' && (dep.startsWith('react-native') || dep.startsWith('@react-native') || dep.startsWith('@shopify')))
        );
      }
    }
    
    currentPath = path.dirname(currentPath);
  }
  
  console.log('未找到主项目的peerDependencies');
  return [];
}

/**
 * 创建Pod名称映射表
 * @returns {Object} - Pod名称到包名的映射
 */
function createPodNameMapping() {
  try {
    // 从配置文件中读取映射表
    const configPath = path.join(__dirname, 'podfile-config.json');
    if (fs.existsSync(configPath)) {
      const config = require(configPath);
      if (config.podNameMapping && Object.keys(config.podNameMapping).length > 0) {
        console.log('使用配置文件中的Pod名称映射表');
        return config.podNameMapping;
      }
    }
  } catch (error) {
    console.log('读取配置文件失败，使用默认映射表', error.message);
  }
  
  // 如果配置文件不存在或读取失败，使用默认映射表
  console.log('使用默认Pod名称映射表');
  return {
    'RNScreens': 'react-native-screens',
    'react-native-safe-area-context': 'react-native-safe-area-context',
    'BVLinearGradient': 'react-native-linear-gradient',
    'RNSVG': 'react-native-svg',
    'react-native-view-shot': 'react-native-view-shot',
    'react-native-webview': 'react-native-webview',
    'RNCPicker': '@react-native-picker/picker',
    'RNCAsyncStorage': '@react-native-async-storage/async-storage',
    'react-native-video': 'react-native-video',
    'react-native-pager-view': 'react-native-pager-view',
    'RNFastImage': 'react-native-fast-image',
    'RNFlashList': '@shopify/flash-list',
    'RNAudioRecorderPlayer': 'react-native-audio-recorder-player',
    'react-native-storage': 'react-native-storage'
  };
}

/**
 * 验证包是否有podspec文件
 * @param {string} packageName - 包名
 * @returns {boolean} - 是否存在podspec文件
 */
function hasPodspecFile(packageName) {
  // 查找node_modules中的包路径
  let currentPath = path.resolve(__dirname);
  
  while (currentPath !== path.dirname(currentPath)) {
    const nodeModulesPath = path.join(currentPath, 'node_modules');
    const packagePath = path.join(nodeModulesPath, packageName);
    
    if (fs.existsSync(packagePath)) {
      try {
        const files = fs.readdirSync(packagePath);
        const hasPodspec = files.some(file => file.endsWith('.podspec'));
        console.log(`检查 ${packageName} podspec文件: ${hasPodspec ? '存在' : '不存在'}`);
        return hasPodspec;
      } catch (error) {
        console.log(`读取包目录失败 ${packageName}:`, error.message);
        return false;
      }
    }
    
    currentPath = path.dirname(currentPath);
  }
  
  console.log(`未找到包: ${packageName}`);
  return false;
}

/**
 * 自动生成Pod配置
 * @returns {Object} - 自动生成的配置对象
 */
function autoGenerateConfig() {
  // 获取主项目的peerDependencies
  const peerDependencies = getMainProjectPeerDependencies();
  
  if (peerDependencies.length === 0) {
    console.log('未找到peerDependencies，使用默认配置');
    try {
      const configPath = path.join(__dirname, 'podfile-config.json');
      if (fs.existsSync(configPath)) {
        const config = require(configPath);
        // 如果配置文件中有自定义的Pod配置，直接使用
        if (config.customPods && Object.keys(config.customPods).length > 0) {
          console.log('使用配置文件中的自定义Pod配置');
          // 验证自定义配置中的包是否有podspec文件
          const validatedConfig = {};
          Object.entries(config.customPods).forEach(([podName, packageName]) => {
            // 跳过注释和示例
            if (podName.startsWith('_') || podName === '示例') {
              return;
            }
            if (hasPodspecFile(packageName)) {
              validatedConfig[podName] = packageName;
            } else {
              console.log(`跳过无podspec文件的包: ${packageName}`);
            }
          });
          return validatedConfig;
        }
      }
    } catch (error) {
      console.log('读取配置文件失败', error.message);
    }
    // 如果没有自定义配置，返回空对象
    return {};
  }
  
  console.log(`找到 ${peerDependencies.length} 个peerDependencies:`, peerDependencies);
  
  // 使用预定义的Pod名称映射
  const podNameMapping = createPodNameMapping();
  const autoConfig = {};
  
  peerDependencies.forEach(dep => {
    // 忽略 react-native 官方库
    if (dep === 'react-native') {
      console.log(`忽略官方库: ${dep}`);
      return;
    }
    
    // 验证包是否有podspec文件
    if (!hasPodspecFile(dep)) {
      console.log(`跳过无podspec文件的包: ${dep}`);
      return;
    }
    
    // 查找对应的Pod名称
    const podName = Object.keys(podNameMapping).find(pod => podNameMapping[pod] === dep);
    
    if (podName) {
      autoConfig[podName] = dep;
      console.log(`映射Pod配置: ${podName} -> ${dep}`);
    } else {
      // 如果没有预定义映射，使用包名作为Pod名称
      autoConfig[dep] = dep;
      console.log(`直接映射Pod配置: ${dep} -> ${dep}`);
    }
  });
  
  console.log(`生成了 ${Object.keys(autoConfig).length} 个Pod配置`);
  return autoConfig;
}

/**
 * 生成pod配置字符串
 * @param {Object} configObject - 配置对象
 * @returns {string} - 生成的pod配置字符串
 */
function generatePodConfigs(configObject) {
  return Object.entries(configObject)
    .map(([podName, packagePath]) => `pod '${podName}', :path => "#\{prefix\}\/${packagePath}"`) 
    .join('\n  ');
}

/**
 * 清理Podfile中的重复配置
 * @param {string} content - Podfile内容
 * @returns {string} - 清理后的内容
 */
function cleanDuplicateConfigs(content) {
  // 移除所有自动生成的pod配置（除了react-native-link-lib本身）
  const lines = content.split('\n');
  const cleanedLines = [];
  let skipNextLines = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 如果找到react-native-link-lib的配置行，标记开始清理
    if (line.includes("pod 'react-native-link-lib', :path =>")) {
      cleanedLines.push(line.replace(/pod 'react-native-link-lib', :path => "#\{prefix\}\/react-native-link-lib".*/, "pod 'react-native-link-lib', :path => \"#\{prefix\}\/react-native-link-lib\""));
      skipNextLines = true;
      continue;
    }
    
    // 如果正在跳过自动生成的配置
    if (skipNextLines) {
      // 检查是否是自动生成的pod配置行
      if (line.trim().startsWith("pod '") && line.includes(":path => \"#\{prefix\}\/")) {
        // 跳过这行，继续下一行
        continue;
      } else {
        // 遇到非自动生成的行，停止跳过
        skipNextLines = false;
        cleanedLines.push(line);
      }
    } else {
      cleanedLines.push(line);
    }
  }
  
  return cleanedLines.join('\n');
}

/**
 * 配置iOS项目
 * @param {string} podfilePath - Podfile路径
 */
function configureIOSProject(podfilePath) {
  if (!podfilePath) {
    console.log('未提供Podfile路径');
    return;
  }

  console.log('开始自动生成iOS Pod配置...');
  const config = autoGenerateConfig();
  
  console.log('生成的iOS配置:', config);
  
  let content = fs.readFileSync(podfilePath, 'utf8');
  
  // 先清理重复配置
  content = cleanDuplicateConfigs(content);
  
  // 生成新的配置
  const podConfigs = generatePodConfigs(config);
  const replacementText = podConfigs ? 
    `pod 'react-native-link-lib', :path => "#\{prefix\}\/react-native-link-lib"\n  ${podConfigs}` :
    `pod 'react-native-link-lib', :path => "#\{prefix\}\/react-native-link-lib"`;
  
  const newContent = content.replace(
    /pod 'react-native-link-lib', :path => "#\{prefix\}\/react-native-link-lib"/,
    replacementText
  );
  
  fs.writeFileSync(podfilePath, newContent);
  console.log('成功修改Podfile文件');
}

// 主执行逻辑
function main() {
  const podfilePath = findPodfile(__dirname);

  if (podfilePath) {
    configureIOSProject(podfilePath);
  } else {
    console.log('未找到Podfile文件');
  }
}

// 导出函数供其他模块使用
module.exports = {
  findPodfile,
  getDependenciesFromPackageJson,
  scanPodspecFiles,
  getMainProjectPeerDependencies,
  createPodNameMapping,
  hasPodspecFile,
  autoGenerateConfig,
  generatePodConfigs,
  cleanDuplicateConfigs,
  configureIOSProject
};

// 如果直接运行此脚本，执行主逻辑
if (require.main === module) {
  main();
}