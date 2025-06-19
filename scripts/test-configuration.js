#!/usr/bin/env node

/**
 * React Native Link Lib - 配置测试脚本
 * 用于验证自动配置功能是否正常工作
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function log(message, level = 'info') {
  const prefix = {
    info: '📋',
    success: '✅',
    warning: '⚠️ ',
    error: '❌'
  }[level] || '📋';
  
  console.log(`${prefix} ${message}`);
}

function testConfiguration() {
  try {
    log('🧪 开始测试 React Native Link Lib 配置功能...');
    
    const testProjectDir = path.join(__dirname, '..', 'example', 'test-project');
    
    // 检查测试项目是否存在
    if (!fs.existsSync(testProjectDir)) {
      log('测试项目不存在，创建测试环境...', 'warning');
      return;
    }
    
    log(`📁 测试项目目录: ${testProjectDir}`);
    
    // 检查 Podfile 是否存在
    const podfilePath = path.join(testProjectDir, 'ios', 'Podfile');
    if (!fs.existsSync(podfilePath)) {
      log('测试项目中没有 Podfile，跳过测试', 'warning');
      return;
    }
    
    // 备份原始 Podfile
    const backupPath = podfilePath + '.test-backup';
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
    }
    fs.copyFileSync(podfilePath, backupPath);
    log('📄 已备份测试 Podfile');
    
    // 运行配置脚本
    log('🔧 运行配置脚本...');
    const configScript = path.join(__dirname, 'configure-podfile-safe.js');
    
    try {
      execSync(`node "${configScript}"`, {
        cwd: testProjectDir,
        stdio: 'pipe'
      });
      log('配置脚本执行成功', 'success');
    } catch (error) {
      log(`配置脚本执行失败: ${error.message}`, 'error');
      return;
    }
    
    // 检查配置是否正确添加
    const podfileContent = fs.readFileSync(podfilePath, 'utf8');
    const hasConfig = podfileContent.includes('React Native Link Lib 依赖配置');
    
    if (hasConfig) {
      log('✅ Podfile 配置验证成功！', 'success');
      
      // 检查具体的依赖项
      const dependencies = [
        'RNCAsyncStorage',
        'RNCPicker',
        'FlashList',
        'RNFastImage',
        'RNSVG'
      ];
      
      let allDepsFound = true;
      dependencies.forEach(dep => {
        if (podfileContent.includes(`pod '${dep}'`)) {
          log(`  ✓ 找到依赖: ${dep}`);
        } else {
          log(`  ✗ 缺少依赖: ${dep}`, 'warning');
          allDepsFound = false;
        }
      });
      
      if (allDepsFound) {
        log('🎉 所有依赖项配置正确！', 'success');
      } else {
        log('部分依赖项配置有问题', 'warning');
      }
    } else {
      log('❌ Podfile 中未找到配置标记', 'error');
    }
    
    // 恢复原始 Podfile
    fs.copyFileSync(backupPath, podfilePath);
    fs.unlinkSync(backupPath);
    log('🔄 已恢复原始 Podfile');
    
    log('🧪 测试完成！', 'success');
    
  } catch (error) {
    log(`测试失败: ${error.message}`, 'error');
    process.exit(1);
  }
}

if (require.main === module) {
  testConfiguration();
}

module.exports = { testConfiguration };