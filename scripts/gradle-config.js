/**
 * Copyright © 2020-2025 Ocean Galaxy Inc. All Rights Reserved.
 * @Description: Android Gradle自动配置脚本 - 扫描依赖并生成settings.gradle配置
 * @LastEditors: yingongjing
 * @LastEditTime: 2025-06-20 11:01:52
 */
const fs = require('fs');
const path = require('path');

/**
 * 递归向上查找settings.gradle文件
 * @param {string} startPath - 开始查找的路径
 * @returns {string|null} - 找到的settings.gradle路径或null
 */
function findSettingsGradle(startPath) {
  let currentPath = path.resolve(startPath);
  
  while (currentPath !== path.dirname(currentPath)) {
    const gradlePath = path.join(currentPath, 'settings.gradle');
    
    if (fs.existsSync(gradlePath)) {
      return gradlePath;
    }
    
    // 向上一级目录
    currentPath = path.dirname(currentPath);
  }
  
  return null;
}

/**
 * 递归向上查找目录
 * @param {string} startPath - 开始查找的路径
 * @param {string} targetDir - 目标目录名
 * @returns {string|null} - 找到的目录路径或null
 */
function findDirUpwards(startPath, targetDir) {
  let currentPath = path.resolve(startPath);
  
  while (currentPath !== path.dirname(currentPath)) {
    const dirPath = path.join(currentPath, targetDir);
    
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
      return dirPath;
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
 * 检查依赖是否有Android配置
 * @param {string} nodeModulesPath - node_modules路径
 * @param {string} dependency - 依赖包名
 * @returns {boolean} - 是否有Android配置
 */
function hasAndroidConfig(nodeModulesPath, dependency) {
  const depPath = path.join(nodeModulesPath, dependency);
  const androidPath = path.join(depPath, 'android');
  
  return fs.existsSync(androidPath) && fs.statSync(androidPath).isDirectory();
}

/**
 * 扫描Android依赖
 * @param {string} nodeModulesPath - node_modules路径
 * @param {string[]} dependencies - 依赖包名列表
 * @returns {Object[]} - Android依赖信息列表
 */
function scanAndroidDependencies(nodeModulesPath, dependencies) {
  const androidDeps = [];
  
  dependencies.forEach(dep => {
    if (hasAndroidConfig(nodeModulesPath, dep)) {
      // 读取package.json获取版本信息
      const packageJsonPath = path.join(nodeModulesPath, dep, 'package.json');
      let version = 'unknown';
      
      if (fs.existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          version = packageJson.version || 'unknown';
        } catch (error) {
          console.log(`读取${dep}的package.json失败:`, error.message);
        }
      }
      
      androidDeps.push({
        name: dep,
        version: version,
        isLinked: true
      });
      
      console.log(`发现Android依赖: ${dep} (${version})`);
    }
  });
  
  return androidDeps;
}

/**
 * 生成settings.gradle内容
 * @param {Object[]} dependencies - 依赖信息列表
 * @returns {string} - 生成的settings.gradle内容
 */
function generateSettingsGradle(dependencies) {
  const header = '// 由ReactNativeLinkLib自动生成的配置\n// 请勿手动修改此文件\n\n';
  let content = header;
  
  dependencies.forEach(dependency => {
    if (dependency.isLinked) {
      const packageName = dependency.name.replace(/-/g, '_');
      content += `include ':${packageName}'\n`;
      content += `project(':${packageName}').projectDir = new File(rootProject.projectDir, '../node_modules/${dependency.name}/android')\n\n`;
    }
  });
  
  return content;
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
 * 配置Android项目
 * @param {string} settingsGradlePath - settings.gradle路径
 * @param {boolean} [writeToOriginal=false] - 是否直接写入原始文件
 * @returns {string|null} - 如果不直接写入，则返回生成的文件路径
 */
function configureAndroidProject(settingsGradlePath, writeToOriginal = false) {
  if (!settingsGradlePath) {
    console.log('未提供settings.gradle路径');
    return null;
  }

  console.log('开始自动生成Android配置...');
  
  // 查找项目根目录
  const projectRoot = path.dirname(settingsGradlePath);
  const nodeModulesPath = path.join(projectRoot, '..', 'node_modules');
  
  // 获取主项目的peerDependencies
  const peerDependencies = getMainProjectPeerDependencies();
  
  if (peerDependencies.length === 0) {
    console.log('未找到peerDependencies，无法生成Android配置');
    return null;
  }
  
  console.log(`找到 ${peerDependencies.length} 个peerDependencies:`, peerDependencies);
  
  // 扫描Android依赖
  const androidDeps = scanAndroidDependencies(nodeModulesPath, peerDependencies);
  
  if (androidDeps.length === 0) {
    console.log('未找到Android依赖，无法生成配置');
    return null;
  }
  
  console.log(`找到 ${androidDeps.length} 个Android依赖`);
  
  // 生成settings.gradle内容
  const content = generateSettingsGradle(androidDeps);
  
  // 确定输出路径
  let outputPath;
  if (writeToOriginal) {
    outputPath = settingsGradlePath;
    // 读取原始文件内容
    const originalContent = fs.readFileSync(settingsGradlePath, 'utf8');
    
    // 检查是否已经包含自动生成的配置
    if (originalContent.includes('由ReactNativeLinkLib自动生成的配置')) {
      // 替换已有的自动生成配置
      const newContent = originalContent.replace(
        /\/\/ 由ReactNativeLinkLib自动生成的配置[\s\S]*?(?=\n\n|$)/,
        content
      );
      fs.writeFileSync(outputPath, newContent);
    } else {
      // 在文件末尾添加自动生成的配置
      fs.writeFileSync(outputPath, originalContent + '\n\n' + content);
    }
  } else {
    // 生成单独的配置文件
    outputPath = path.join(projectRoot, 'settings.gradle.generated');
    fs.writeFileSync(outputPath, content);
  }
  
  console.log(`成功生成Android配置文件: ${outputPath}`);
  if (!writeToOriginal) {
    console.log('请将生成的配置内容合并到settings.gradle文件中');
  }
  
  return outputPath;
}

// 主执行逻辑
function main() {
  const settingsGradlePath = findSettingsGradle(__dirname);

  if (settingsGradlePath) {
    configureAndroidProject(settingsGradlePath);
  } else {
    console.log('未找到settings.gradle文件');
  }
}

// 导出函数供其他模块使用
module.exports = {
  findSettingsGradle,
  findDirUpwards,
  getDependenciesFromPackageJson,
  hasAndroidConfig,
  scanAndroidDependencies,
  generateSettingsGradle,
  getMainProjectPeerDependencies,
  configureAndroidProject
};

// 如果直接运行此脚本，执行主逻辑
if (require.main === module) {
  main();
}