/*
 * Copyright © 2020-2025 Ocean Galaxy Inc. All Rights Reserved.
 * @Description: 
 * @LastEditors: yingongjing
 * @LastEditTime: 2025-06-19 10:18:48
 */
import { NativeModules } from 'react-native';

interface XCVideoConfig {
  url: string;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
}

export function validateVideoConfig(config: XCVideoConfig): boolean {
  if (!config.url) {
    return false;
  }
  return true;
}