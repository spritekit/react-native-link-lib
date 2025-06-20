/**
 * Copyright © 2020-2025 Ocean Galaxy Inc. All Rights Reserved.
 * @Description: 自动扫描依赖并生成Pod配置
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
  
  return Object.keys(dependencies).filter(dep => dep.startsWith('react-native') || dep.startsWith('@react-native'));
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
      const nameMatch = podspecContent.match(/s\.name\s*=\s*['"]([^'"]+)['"]/)
        || podspecContent.match(/Pod::Spec\.new\s*do\s*\|s\|[\s\S]*?s\.name\s*=\s*['"]([^'"]+)['"]/)
        || podspecContent.match(/spec\.name\s*=\s*['"]([^'"]+)['"]/)
        || podspecContent.match(/name:\s*['"]([^'"]+)['"]/)
        || podspecContent.match(/name\s*=\s*['"]([^'"]+)['"]/)
        || podspecContent.match(/^\s*['"]([^'"]+)['"]/);
      
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
 * 检查依赖包是否有.podspec文件
 * @param {string} packagePath - 依赖包路径
 * @returns {boolean} - 是否有.podspec文件
 */
function hasPodspecFile(packagePath) {
  if (!fs.existsSync(packagePath)) {
    console.log(`依赖包不存在: ${packagePath}`);
    return false;
  }
  
  try {
    // 查找.podspec文件
    const files = fs.readdirSync(packagePath);
    return files.some(file => file.endsWith('.podspec'));
  } catch (error) {
    console.log(`检查podspec文件失败: ${packagePath}`, error.message);
    return false;
  }
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
          return config.customPods;
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
  const nodeModulesPath = path.resolve(process.cwd(), 'node_modules');
  
  peerDependencies.forEach(dep => {
    // 忽略 react-native 官方库
    if (dep === 'react-native') {
      console.log(`忽略官方库: ${dep}`);
      return;
    }
    
    // 检查依赖包是否有.podspec文件
    const depPath = path.join(nodeModulesPath, dep);
    const hasPodspec = hasPodspecFile(depPath);
    
    if (!hasPodspec) {
      console.log(`依赖包没有podspec文件，跳过: ${dep}`);
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

// 主执行逻辑
function main() {
  const podfilePath = findPodfile(__dirname);

  if (podfilePath) {
    console.log('开始自动生成Pod配置...');
    const config = autoGenerateConfig();
    
    console.log('生成的配置:', config);
    
    const content = fs.readFileSync(podfilePath, 'utf8');
    const replacementText = `pod 'react-native-link-lib', :path => "#\{prefix\}\/react-native-link-lib"\n  ` + 
      generatePodConfigs(config);
    const newContent = content.replace(
      /pod 'react-native-link-lib', :path => "#\{prefix\}\/react-native-link-lib"/,
      replacementText
    );
    fs.writeFileSync(podfilePath, newContent);
    console.log('成功修改Podfile文件');
  } else {
    console.log('未找到Podfile文件');
  }
}

// 导出函数供测试使用
module.exports = {
  findPodfile,
  getDependenciesFromPackageJson,
  scanPodspecFiles,
  hasPodspecFile,
  getMainProjectPeerDependencies,
  createPodNameMapping,
  autoGenerateConfig,
  generatePodConfigs
};

// 如果直接运行此脚本，执行主逻辑
if (require.main === module) {
  main();
}