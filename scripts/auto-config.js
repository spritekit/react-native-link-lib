/**
 * Copyright © 2020-2025 Ocean Galaxy Inc. All Rights Reserved.
 * @Description: 智能自动配置脚本 - 自动判断项目类型并生成相应配置
 * @LastEditors: yingongjing
 * @LastEditTime: 2025-06-20 11:01:52
 */
const fs = require('fs');
const path = require('path');

// 导入平台特定的配置模块
const iosConfig = require('./podfile-config');
const androidConfig = require('./gradle-config');

/**
 * 项目类型枚举
 */
const ProjectType = {
  IOS: 'ios',
  ANDROID: 'android',
  BOTH: 'both',
  UNKNOWN: 'unknown'
};

/**
 * 递归向上查找文件
 * @param {string} startPath - 开始查找的路径
 * @param {string} targetFile - 目标文件名
 * @returns {string|null} - 找到的文件路径或null
 */
function findFileUpwards(startPath, targetFile) {
  let currentPath = path.resolve(startPath);
  
  while (currentPath !== path.dirname(currentPath)) {
    const filePath = path.join(currentPath, targetFile);
    
    if (fs.existsSync(filePath)) {
      return filePath;
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
 * 检测项目类型
 * @param {string} startPath - 开始检测的路径
 * @returns {string} - 项目类型
 */
function detectProjectType(startPath) {
  const podfilePath = findFileUpwards(startPath, 'Podfile');
  const gradlePath = findFileUpwards(startPath, 'settings.gradle');
  const androidDirPath = findDirUpwards(startPath, 'android');
  const iosDirPath = findDirUpwards(startPath, 'ios');
  
  const hasIOS = podfilePath !== null || iosDirPath !== null;
  const hasAndroid = gradlePath !== null || androidDirPath !== null;
  
  if (hasIOS && hasAndroid) {
    return ProjectType.BOTH;
  } else if (hasIOS) {
    return ProjectType.IOS;
  } else if (hasAndroid) {
    return ProjectType.ANDROID;
  } else {
    return ProjectType.UNKNOWN;
  }
}

/**
 * 主执行逻辑
 */
function main() {
  console.log('开始智能自动配置...');
  
  // 检测项目类型
  const projectType = detectProjectType(__dirname);
  console.log(`检测到项目类型: ${projectType}`);
  
  switch (projectType) {
    case ProjectType.IOS:
      const podfilePath = findFileUpwards(__dirname, 'Podfile');
      if (podfilePath) {
        iosConfig.configureIOSProject(podfilePath);
      } else {
        console.log('未找到Podfile文件，无法配置iOS项目');
      }
      break;
      
    case ProjectType.ANDROID:
      const gradlePath = findFileUpwards(__dirname, 'settings.gradle');
      if (gradlePath) {
        androidConfig.configureAndroidProject(gradlePath);
      } else {
        console.log('未找到settings.gradle文件，无法配置Android项目');
      }
      break;
      
    case ProjectType.BOTH:
      console.log('检测到同时包含iOS和Android项目，将配置两种平台');
      
      const podfile = findFileUpwards(__dirname, 'Podfile');
      if (podfile) {
        iosConfig.configureIOSProject(podfile);
      } else {
        console.log('未找到Podfile文件，无法配置iOS项目');
      }
      
      const gradle = findFileUpwards(__dirname, 'settings.gradle');
      if (gradle) {
        androidConfig.configureAndroidProject(gradle);
      } else {
        console.log('未找到settings.gradle文件，无法配置Android项目');
      }
      break;
      
    default:
      console.log('未检测到iOS或Android项目，无法进行自动配置');
      break;
  }
}

// 导出函数供测试使用
module.exports = {
  detectProjectType,
  findFileUpwards,
  findDirUpwards
};

// 如果直接运行此脚本，执行主逻辑
if (require.main === module) {
  main();
}