package com.reactnativelinklib;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.module.annotations.ReactModule;

import java.util.HashMap;
import java.util.Map;

/**
 * React Native Link Lib 模块
 * 提供原生依赖管理和版本信息功能
 */
@ReactModule(name = ReactNativeLinkLibModule.NAME)
public class ReactNativeLinkLibModule extends ReactContextBaseJavaModule {
    public static final String NAME = "ReactNativeLinkLib";

    private final ReactApplicationContext reactContext;

    public ReactNativeLinkLibModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    /**
     * 获取所有集成库的版本信息
     * @param promise Promise对象，用于返回结果
     */
    @ReactMethod
    public void getLibraryVersions(Promise promise) {
        try {
            WritableMap versions = Arguments.createMap();
            
            // 添加各个库的版本信息
            versions.putString("asyncStorage", "1.17.11");
            versions.putString("picker", "2.4.8");
            versions.putString("flashList", "1.4.0");
            versions.putString("audioRecorderPlayer", "3.5.1");
            versions.putString("fastImage", "8.6.3");
            versions.putString("fs", "2.20.0");
            versions.putString("linearGradient", "2.6.2");
            versions.putString("pagerView", "6.1.2");
            versions.putString("safeAreaContext", "4.5.0");
            versions.putString("screens", "3.20.0");
            versions.putString("svg", "13.8.0");
            versions.putString("update", "1.0.0");
            versions.putString("video", "5.2.1");
            versions.putString("viewShot", "3.6.0");
            versions.putString("webview", "11.26.1");
            
            promise.resolve(versions);
        } catch (Exception e) {
            promise.reject("ERR_UNEXPECTED", "获取库版本信息失败: " + e.getMessage());
        }
    }

    /**
     * 检查特定库是否已集成
     * @param libraryName 库名称
     * @param promise Promise对象，用于返回结果
     */
    @ReactMethod
    public void isLibraryIntegrated(String libraryName, Promise promise) {
        try {
            Map<String, Boolean> libraryMap = new HashMap<>();
            libraryMap.put("asyncStorage", true);
            libraryMap.put("picker", true);
            libraryMap.put("flashList", true);
            libraryMap.put("audioRecorderPlayer", true);
            libraryMap.put("fastImage", true);
            libraryMap.put("fs", true);
            libraryMap.put("linearGradient", true);
            libraryMap.put("pagerView", true);
            libraryMap.put("safeAreaContext", true);
            libraryMap.put("screens", true);
            libraryMap.put("svg", true);
            libraryMap.put("update", true);
            libraryMap.put("video", true);
            libraryMap.put("viewShot", true);
            libraryMap.put("webview", true);
            
            Boolean isIntegrated = libraryMap.getOrDefault(libraryName, false);
            promise.resolve(isIntegrated);
        } catch (Exception e) {
            promise.reject("ERR_UNEXPECTED", "检查库集成状态失败: " + e.getMessage());
        }
    }

    /**
     * 获取模块配置信息
     * @param promise Promise对象，用于返回结果
     */
    @ReactMethod
    public void getConfig(Promise promise) {
        try {
            WritableMap config = Arguments.createMap();
            config.putBoolean("autoConfig", true);
            config.putBoolean("debug", BuildConfig.DEBUG);
            
            promise.resolve(config);
        } catch (Exception e) {
            promise.reject("ERR_UNEXPECTED", "获取配置信息失败: " + e.getMessage());
        }
    }

    /**
     * 更新模块配置
     * @param configMap 新的配置信息
     * @param promise Promise对象，用于返回结果
     */
    @ReactMethod
    public void updateConfig(ReadableMap configMap, Promise promise) {
        try {
            // 在实际应用中，这里应该保存配置到SharedPreferences或其他持久化存储
            // 这里简单返回接收到的配置
            promise.resolve(configMap);
        } catch (Exception e) {
            promise.reject("ERR_UNEXPECTED", "更新配置失败: " + e.getMessage());
        }
    }
}