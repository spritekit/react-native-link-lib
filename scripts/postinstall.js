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
 * 自动生成Pod配置
 * @returns {Object} - 自动生成的配置对象
 */
function autoGenerateConfig() {
  // 查找项目根目录的package.json
  let currentPath = path.resolve(__dirname);
  let packageJsonPath = null;
  let nodeModulesPath = null;
  
  // 向上查找package.json和node_modules
  while (currentPath !== path.dirname(currentPath)) {
    const testPackageJson = path.join(currentPath, 'package.json');
    const testNodeModules = path.join(currentPath, 'node_modules');
    
    if (fs.existsSync(testPackageJson) && fs.existsSync(testNodeModules)) {
      packageJsonPath = testPackageJson;
      nodeModulesPath = testNodeModules;
      break;
    }
    
    currentPath = path.dirname(currentPath);
  }
  
  if (!packageJsonPath || !nodeModulesPath) {
    console.log('未找到package.json或node_modules，使用默认配置');
    return require('./podfile-config.json');
  }
  
  console.log(`扫描依赖: ${packageJsonPath}`);
  console.log(`扫描模块: ${nodeModulesPath}`);
  
  const dependencies = getDependenciesFromPackageJson(packageJsonPath);
  const autoConfig = scanPodspecFiles(nodeModulesPath, dependencies);
  
  // 如果自动扫描结果为空，回退到手动配置
  if (Object.keys(autoConfig).length === 0) {
    console.log('自动扫描未找到配置，使用手动配置文件');
    return require('./podfile-config.json');
  }
  
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
  autoGenerateConfig,
  generatePodConfigs
};

// 如果直接运行此脚本，执行主逻辑
if (require.main === module) {
  main();
}