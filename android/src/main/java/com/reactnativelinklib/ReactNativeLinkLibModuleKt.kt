package com.reactnativelinklib

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File

/**
 * React Native Link Lib 模块 - Kotlin 实现
 * 提供原生依赖管理和版本信息功能
 */
@ReactModule(name = ReactNativeLinkLibModuleKt.NAME)
class ReactNativeLinkLibModuleKt(private val reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {
    
    companion object {
        const val NAME = "ReactNativeLinkLibKt"
    }
    
    private val moduleScope = CoroutineScope(Dispatchers.Main)
    
    override fun getName(): String = NAME
    
    // 使用管理器类管理库版本和依赖信息
    private val versionManager by lazy { LibraryVersionManager(reactContext) }
    private val dependencyManager by lazy { DependencyManager(reactContext) }
    
    /**
     * 获取所有集成库的版本信息
     * 使用Kotlin协程处理异步操作
     */
    @ReactMethod
    fun getLibraryVersions(promise: Promise) {
        moduleScope.launch {
            try {
                val libraryInfoList = versionManager.getAllLibraryInfo()
                val versions = Arguments.createMap().apply {
                    // 使用LibraryVersionManager获取版本信息
                    libraryInfoList.forEach { info ->
                        putString(info.name, info.version)
                    }
                }
                promise.resolve(versions)
            } catch (e: Exception) {
                promise.reject("ERR_UNEXPECTED", "获取库版本信息失败: ${e.message}")
            }
        }
    }

    /**
     * 检查特定库是否已集成
     * 使用LibraryVersionManager简化代码
     */
    @ReactMethod
    fun isLibraryIntegrated(libraryName: String, promise: Promise) {
        moduleScope.launch {
            try {
                val isIntegrated = versionManager.isLibraryIntegrated(libraryName)
                promise.resolve(isIntegrated)
            } catch (e: Exception) {
                promise.reject("ERR_UNEXPECTED", "检查库集成状态失败: ${e.message}")
            }
        }
    }

    /**
     * 获取模块配置信息
     * 使用DependencyManager获取配置
     */
    @ReactMethod
    fun getConfig(promise: Promise) {
        moduleScope.launch {
            try {
                val config = dependencyManager.getConfig()
                val configMap = Arguments.createMap().apply {
                    putBoolean("autoConfig", config.autoConfig)
                    putBoolean("debug", config.debug)
                    
                    // 添加自定义Pod映射
                    val podMappingMap = Arguments.createMap()
                    config.customPodMapping.forEach { (key, value) ->
                        podMappingMap.putString(key, value)
                    }
                    putMap("customPodMapping", podMappingMap)
                }
                promise.resolve(configMap)
            } catch (e: Exception) {
                promise.reject("ERR_UNEXPECTED", "获取配置信息失败: ${e.message}")
            }
        }
    }

    /**
     * 更新模块配置
     * 使用DependencyManager保存配置
     */
    @ReactMethod
    fun updateConfig(configMap: ReadableMap, promise: Promise) {
        moduleScope.launch {
            try {
                // 从ReadableMap中提取配置信息
                val autoConfig = configMap.getBoolean("autoConfig")
                val debug = configMap.getBoolean("debug")
                
                // 提取自定义Pod映射
                val customPodMapping = mutableMapOf<String, String>()
                if (configMap.hasKey("customPodMapping")) {
                    val podMappingMap = configMap.getMap("customPodMapping")
                    podMappingMap?.keySetIterator()?.let { keyIterator ->
                        while (keyIterator.hasNextKey()) {
                            val key = keyIterator.nextKey()
                            customPodMapping[key] = podMappingMap.getString(key) ?: ""
                        }
                    }
                }
                
                // 创建配置对象并保存
                val config = DependencyManager.XCConfig(
                    autoConfig = autoConfig,
                    debug = debug,
                    customPodMapping = customPodMapping
                )
                dependencyManager.updateConfig(config)
                
                promise.resolve(configMap)
            } catch (e: Exception) {
                promise.reject("ERR_UNEXPECTED", "更新配置失败: ${e.message}")
            }
        }
    }
    
    /**
     * 扫描项目中的React Native依赖
     */
    @ReactMethod
    fun scanDependencies(projectPath: String, promise: Promise) {
        moduleScope.launch {
            try {
                val dependencies = dependencyManager.scanDependencies(projectPath)
                
                val result = Arguments.createArray()
                dependencies.forEach { dependency ->
                    val depMap = Arguments.createMap().apply {
                        putString("name", dependency.name)
                        putString("version", dependency.version)
                        putString("podName", dependency.podName ?: "")
                        putBoolean("isLinked", dependency.isLinked)
                    }
                    result.pushMap(depMap)
                }
                
                promise.resolve(result)
            } catch (e: Exception) {
                promise.reject("ERR_UNEXPECTED", "扫描依赖失败: ${e.message}")
            }
        }
    }
    
    /**
     * 生成Android配置文件
     */
    @ReactMethod
    fun generateAndroidConfig(projectPath: String, outputPath: String, promise: Promise) {
        moduleScope.launch {
            try {
                val dependencies = dependencyManager.scanDependencies(projectPath)
                val success = dependencyManager.generateAndroidConfig(dependencies, outputPath)
                
                if (success) {
                    val result = Arguments.createMap().apply {
                        putString("outputPath", outputPath)
                        putInt("dependencyCount", dependencies.size)
                        putBoolean("success", true)
                    }
                    promise.resolve(result)
                } else {
                    promise.reject("ERR_GENERATION", "生成Android配置失败")
                }
            } catch (e: Exception) {
                promise.reject("ERR_UNEXPECTED", "生成Android配置失败: ${e.message}")
            }
        }
    }
    
    /**
     * 生成iOS配置文件
     */
    @ReactMethod
    fun generateIosConfig(projectPath: String, outputPath: String, promise: Promise) {
        moduleScope.launch {
            try {
                val dependencies = dependencyManager.scanDependencies(projectPath)
                val success = dependencyManager.generateIosConfig(dependencies, outputPath)
                
                if (success) {
                    val result = Arguments.createMap().apply {
                        putString("outputPath", outputPath)
                        putInt("dependencyCount", dependencies.size)
                        putBoolean("success", true)
                    }
                    promise.resolve(result)
                } else {
                    promise.reject("ERR_GENERATION", "生成iOS配置失败")
                }
            } catch (e: Exception) {
                promise.reject("ERR_UNEXPECTED", "生成iOS配置失败: ${e.message}")
            }
        }
    }
    
    /**
     * 获取库信息（异步示例）
     * 展示如何使用Kotlin协程处理IO操作
     */
    @ReactMethod
    fun getLibraryInfoAsync(libraryName: String, promise: Promise) {
        moduleScope.launch {
            try {
                // 使用LibraryVersionManager获取库信息
                val libraryInfo = versionManager.getLibraryInfo(libraryName)
                
                if (libraryInfo != null) {
                    // 获取库的依赖关系
                    val dependencies = versionManager.getLibraryDependencies(libraryName)
                    
                    // 获取应用版本信息
                    val appInfo = versionManager.getAppVersionInfo()
                    
                    val result = Arguments.createMap().apply {
                        putString("name", libraryInfo.name)
                        putString("version", libraryInfo.version)
                        putBoolean("isIntegrated", libraryInfo.isIntegrated)
                        
                        // 添加依赖信息
                        val dependenciesArray = Arguments.createArray()
                        dependencies.forEach { dependenciesArray.pushString(it) }
                        putArray("dependencies", dependenciesArray)
                        
                        // 添加应用信息
                        val appInfoMap = Arguments.createMap()
                        appInfo.forEach { (key, value) -> appInfoMap.putString(key, value) }
                        putMap("appInfo", appInfoMap)
                    }
                    
                    promise.resolve(result)
                } else {
                    promise.reject("ERR_NOT_FOUND", "找不到库: $libraryName")
                }
            } catch (e: Exception) {
                promise.reject("ERR_UNEXPECTED", "获取库信息失败: ${e.message}")
            }
        }
    }
    
    /**
     * 比较两个版本号
     * @param version1 版本号1
     * @param version2 版本号2
     * @param promise Promise对象
     */
    @ReactMethod
    fun compareVersions(version1: String, version2: String, promise: Promise) {
        moduleScope.launch {
            try {
                val result = VersionUtils.compareVersions(version1, version2)
                promise.resolve(result)
            } catch (e: Exception) {
                promise.reject("ERR_UNEXPECTED", "比较版本失败: ${e.message}")
            }
        }
    }
    
    /**
     * 检查版本是否在指定范围内
     * @param version 要检查的版本
     * @param minVersion 最小版本（包含）
     * @param maxVersion 最大版本（不包含），如果为null则不检查上限
     * @param promise Promise对象
     */
    @ReactMethod
    fun isVersionInRange(version: String, minVersion: String, maxVersion: String?, promise: Promise) {
        moduleScope.launch {
            try {
                val result = VersionUtils.isVersionInRange(version, minVersion, maxVersion)
                promise.resolve(result)
            } catch (e: Exception) {
                promise.reject("ERR_UNEXPECTED", "检查版本范围失败: ${e.message}")
            }
        }
    }
    
    /**
     * 获取版本的主要版本号
     * @param version 完整版本号
     * @param promise Promise对象
     */
    @ReactMethod
    fun getMajorVersion(version: String, promise: Promise) {
        moduleScope.launch {
            try {
                val result = VersionUtils.getMajorVersion(version)
                promise.resolve(result)
            } catch (e: Exception) {
                promise.reject("ERR_UNEXPECTED", "获取主要版本号失败: ${e.message}")
            }
        }
    }
}