/**
 * Copyright © 2020-2025 Ocean Galaxy Inc. All Rights Reserved.
 * @Description: 自动扫描依赖并生成Pod配置
 * @LastEditors: yingongjing
 * @LastEditTime: 2025-06-20 11:01:52
 */
const fs = require('fs');
const path = require('path');

/**
 * 查找Podfile文件
 * @param {string} [startDir] - 开始查找的目录，默认为当前工作目录
 * @returns {string|null} - Podfile文件路径或null
 */
function findPodfile(startDir) {
  const baseDir = startDir || process.cwd();
  
  // 查找当前目录下的Podfile
  const currentDirPodfile = path.resolve(baseDir, 'Podfile');
  if (fs.existsSync(currentDirPodfile)) {
    console.log(`找到Podfile在当前目录: ${currentDirPodfile}`);
    return currentDirPodfile;
  }
  
  // 查找ios目录下的Podfile
  const iosDirPodfile = path.resolve(baseDir, 'ios', 'Podfile');
  if (fs.existsSync(iosDirPodfile)) {
    console.log(`找到Podfile在ios目录: ${iosDirPodfile}`);
    return iosDirPodfile;
  }
  
  // 向上查找两级目录
  const parentDir = path.resolve(baseDir, '..');
  const parentDirPodfile = path.resolve(parentDir, 'Podfile');
  if (fs.existsSync(parentDirPodfile)) {
    console.log(`找到Podfile在父目录: ${parentDirPodfile}`);
    return parentDirPodfile;
  }
  
  const grandParentDir = path.resolve(baseDir, '..', '..');
  const grandParentDirPodfile = path.resolve(grandParentDir, 'Podfile');
  if (fs.existsSync(grandParentDirPodfile)) {
    console.log(`找到Podfile在祖父目录: ${grandParentDirPodfile}`);
    return grandParentDirPodfile;
  }
  
  // 查找ios子目录下的所有子目录
  try {
    const iosDir = path.resolve(baseDir, 'ios');
    if (fs.existsSync(iosDir) && fs.statSync(iosDir).isDirectory()) {
      console.log(`检查ios目录: ${iosDir}`);
      const iosDirEntries = fs.readdirSync(iosDir);
      
      for (const entry of iosDirEntries) {
        const entryPath = path.resolve(iosDir, entry);
        if (fs.statSync(entryPath).isDirectory()) {
          const subDirPodfile = path.resolve(entryPath, 'Podfile');
          if (fs.existsSync(subDirPodfile)) {
            console.log(`找到Podfile在ios子目录: ${subDirPodfile}`);
            return subDirPodfile;
          }
        }
      }
    }
  } catch (error) {
    console.log(`搜索ios子目录时出错: ${error.message}`);
  }
  
  // 特定路径检查 - 示例项目
  const samplePodfile = path.resolve(baseDir, 'ios', 'react-native-link-lib-sample', 'Podfile');
  if (fs.existsSync(samplePodfile)) {
    console.log(`找到示例项目Podfile: ${samplePodfile}`);
    return samplePodfile;
  }
  
  console.log(`当前工作目录: ${process.cwd()}`);
  console.log(`搜索目录: ${baseDir}`);
  console.log('未能找到Podfile文件');
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
    try {
      const files = fs.readdirSync(depPath);
      const podspecFile = files.find(file => file.endsWith('.podspec'));
      
      if (podspecFile) {
        // 直接使用podspec文件名（去掉.podspec后缀）作为Pod名称
        const podName = podspecFile.replace('.podspec', '');
        podConfigs[podName] = dep;
        console.log(`发现Pod配置: ${podName} -> ${dep}`);
      }
    } catch (error) {
      console.log(`扫描依赖包出错: ${dep}, 错误: ${error.message}`);
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
          dep.startsWith('react-native') || dep.startsWith('@react-native') || dep.startsWith('@shopify')
        );
      }
    }
    
    currentPath = path.dirname(currentPath);
  }
  
  console.log('未找到主项目的peerDependencies');
  return [];
}

/**
 * 创建Pod名称到包名的映射
 * @returns {Object} - Pod名称到包名的映射
 */
function createPodNameMapping() {
  return {
    // React Native 社区库
    'RNScreens': 'react-native-screens',
    'react-native-safe-area-context': 'react-native-safe-area-context',
    'react-native-webview': 'react-native-webview',
    'react-native-video': 'react-native-video',
    'react-native-view-shot': 'react-native-view-shot',
    'react-native-pager-view': 'react-native-pager-view',
    'RNCAsyncStorage': '@react-native-async-storage/async-storage',
    'RNCPicker': '@react-native-picker/picker',
    'BVLinearGradient': 'react-native-linear-gradient',
    'RNSVG': 'react-native-svg',
    'RNFastImage': 'react-native-fast-image',
    'RNFlashList': '@shopify/flash-list',
    'RNAudioRecorderPlayer': 'react-native-audio-recorder-player',
    
    // 其他库
    'react-native-storage': 'react-native-storage',
    'react-native-popover-view': 'react-native-popover-view'
  };
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
    return require('./podfile-config.json');
  }
  
  console.log(`找到 ${peerDependencies.length} 个peerDependencies`);
  
  // 使用预定义的Pod名称映射
  const podNameMapping = createPodNameMapping();
  const autoConfig = {};
  
  // 查找node_modules路径
  const nodeModulesPath = path.resolve(process.cwd(), 'node_modules');
  let podspecConfigs = {};
  
  // 如果node_modules目录存在，尝试扫描podspec文件
  if (fs.existsSync(nodeModulesPath)) {
    podspecConfigs = scanPodspecFiles(nodeModulesPath, peerDependencies);
    console.log(`从podspec文件扫描到 ${Object.keys(podspecConfigs).length} 个Pod配置`);
  }
  
  // 确保添加react-native-link-lib的配置
  autoConfig['react-native-link-lib'] = 'react-native-link-lib';
  
  // 处理所有peerDependencies
  let mappingCount = 0;
  let podspecCount = 0;
  let fallbackCount = 0;
  
  peerDependencies.forEach(dep => {
    // 1. 首先查找预定义映射
    const podName = Object.keys(podNameMapping).find(pod => podNameMapping[pod] === dep);
    
    if (podName) {
      autoConfig[podName] = dep;
      mappingCount++;
    } 
    // 2. 然后查找podspec扫描结果
    else {
      const podspecName = Object.keys(podspecConfigs).find(key => podspecConfigs[key] === dep);
      if (podspecName) {
        autoConfig[podspecName] = dep;
        podspecCount++;
      } 
      // 3. 最后使用包名作为Pod名称
      else {
        autoConfig[dep] = dep;
        fallbackCount++;
      }
    }
  });
  
  console.log(`Pod配置来源统计: 映射表(${mappingCount}), podspec扫描(${podspecCount}), 包名回退(${fallbackCount})`);
  console.log(`总共生成了 ${Object.keys(autoConfig).length} 个Pod配置`);
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
 * 修改Podfile文件
 * @param {string} podfilePath - Podfile文件路径
 * @param {Object} podConfigs - Pod配置对象
 */
function modifyPodfile(podfilePath, podConfigs) {
  if (!fs.existsSync(podfilePath)) {
    console.log(`Podfile不存在: ${podfilePath}`);
    return;
  }
  
  let podfileContent = fs.readFileSync(podfilePath, 'utf8');
  
  // 查找target行后的位置
  const targetMatch = podfileContent.match(/target\s+['"](.*?)['"]\s+do/i);
  
  if (!targetMatch) {
    console.log('无法在Podfile中找到target行');
    return;
  }
  
  // 清除已有的Pod配置
  // 查找target块的结束位置
  const targetEndMatch = podfileContent.match(/end\s*$/m);
  if (!targetEndMatch) {
    console.log('无法在Podfile中找到target块的结束位置');
    return;
  }
  
  // 提取target块之前和之后的内容
  const targetStartIndex = targetMatch.index + targetMatch[0].length;
  const targetEndIndex = targetEndMatch.index;
  
  // 提取target块中的基本内容（排除已有的Pod配置）
  const targetBlockContent = podfileContent.slice(targetStartIndex, targetEndIndex);
  const cleanedTargetContent = targetBlockContent.replace(/\s*prefix\s*=\s*['"](.*?)['"]\s*\n|\s*pod\s+['"](.*?)['"].*?\n/g, '');
  
  // 添加前缀变量和新的Pod配置
  let newTargetContent = cleanedTargetContent + "\n    prefix = 'react-native/node_modules'\n";
  
  // 生成Pod配置行
  Object.keys(podConfigs).forEach(podName => {
    const packageName = podConfigs[podName];
    newTargetContent += `  pod '${podName}', :path => "\#{prefix}/${packageName}"\n`;
  });
  
  // 重建Podfile内容
  podfileContent = podfileContent.slice(0, targetStartIndex) + newTargetContent + podfileContent.slice(targetEndIndex);
  
  // 写入修改后的内容
  fs.writeFileSync(podfilePath, podfileContent);
  console.log('成功修改Podfile文件');
}

// 主执行逻辑
function main() {
  const podfilePath = findPodfile();
  if (podfilePath) {
    console.log(`找到Podfile: ${podfilePath}`);
    const config = autoGenerateConfig();
    
    // 使用JSON.stringify格式化输出，避免重复
    console.log('生成的配置:', JSON.stringify(config, null, 2));
    modifyPodfile(podfilePath, config);
  } else {
    console.log('未找到Podfile文件');
  }
}

// 导出函数供测试使用
module.exports = {
  findPodfile,
  getDependenciesFromPackageJson,
  scanPodspecFiles,
  getMainProjectPeerDependencies,
  createPodNameMapping,
  autoGenerateConfig,
  generatePodConfigs
};

// 如果直接运行此脚本，执行主逻辑
if (require.main === module) {
  main();
}