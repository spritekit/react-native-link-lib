/*
 * Copyright © 2020-2025 Ocean Galaxy Inc. All Rights Reserved.
 * @Description: React Native Link Library
 * @LastEditors: yingongjing yingongjing@qq.com
 * @LastEditTime: 2025-06-20 15:34:35
 */

/**
 * React Native Link Library 配置接口
 */
export interface XCLinkLibConfig {
  /** 是否启用自动配置 */
  autoConfig?: boolean;
  /** 自定义Pod配置映射 */
  customPodMapping?: Record<string, string>;
  /** 调试模式 */
  debug?: boolean;
}

/**
 * 依赖包信息接口
 */
export interface XCDependencyInfo {
  /** 包名 */
  name: string;
  /** 版本 */
  version: string;
  /** 是否有podspec文件 */
  hasPodspec: boolean;
  /** Pod名称 */
  podName?: string;
}

/**
 * React Native Link Library 管理器
 */
export class LinkLibManager {
  private config: XCLinkLibConfig;

  constructor(config: XCLinkLibConfig = {}) {
    this.config = {
      autoConfig: true,
      debug: false,
      ...config,
    };
  }

  /**
   * 获取当前配置
   */
  getConfig(): XCLinkLibConfig {
    return { ...this.config };
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<XCLinkLibConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * 获取库版本信息
   */
  getVersion(): string {
    return '1.0.54';
  }
}

/**
 * 默认导出
 */
export default LinkLibManager;

/**
 * 便捷函数：创建LinkLibManager实例
 */
export function createLinkLibManager(config?: XCLinkLibConfig): LinkLibManager {
  return new LinkLibManager(config);
}