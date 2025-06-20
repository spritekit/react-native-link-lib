package com.reactnativelinklib

import android.content.Context
import android.content.SharedPreferences
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.File

/**
 * 依赖管理器
 * 处理React Native库的依赖关系和配置
 */
class DependencyManager(private val context: Context) {

    companion object {
        private const val PREFS_NAME = "ReactNativeLinkLibPrefs"
        private const val KEY_CONFIG = "config"
    }

    /**
     * 配置数据类
     */
    data class XCConfig(
        val autoConfig: Boolean = true,
        val debug: Boolean = false,
        val customPodMapping: Map<String, String> = emptyMap()
    )

    /**
     * 依赖信息数据类
     */
    data class XCDependencyInfo(
        val name: String,
        val version: String,
        val podName: String? = null,
        val isLinked: Boolean = false
    )

    // 获取SharedPreferences实例
    private val prefs: SharedPreferences by lazy {
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    /**
     * 获取当前配置
     */
    fun getConfig(): XCConfig {
        val configJson = prefs.getString(KEY_CONFIG, null) ?: return XCConfig()
        return try {
            val json = JSONObject(configJson)
            XCConfig(
                autoConfig = json.optBoolean("autoConfig", true),
                debug = json.optBoolean("debug", false),
                customPodMapping = json.optJSONObject("customPodMapping")?.let { podObj ->
                    val map = mutableMapOf<String, String>()
                    podObj.keys().forEach { key ->
                        map[key] = podObj.getString(key)
                    }
                    map
                } ?: emptyMap()
            )
        } catch (e: Exception) {
            XCConfig()
        }
    }

    /**
     * 更新配置
     */
    fun updateConfig(config: XCConfig) {
        val json = JSONObject().apply {
            put("autoConfig", config.autoConfig)
            put("debug", config.debug)
            put("customPodMapping", JSONObject().apply {
                config.customPodMapping.forEach { (key, value) ->
                    put(key, value)
                }
            })
        }

        prefs.edit().putString(KEY_CONFIG, json.toString()).apply()
    }

    /**
     * 扫描项目中的React Native依赖
     * 使用DependencyScanner扫描依赖
     * @param projectPath 项目路径
     * @return 依赖列表
     */
    suspend fun scanDependencies(projectPath: String): List<XCDependencyInfo> = withContext(Dispatchers.IO) {
        val scanner = DependencyScanner()
        return@withContext scanner.scanDependencies(projectPath)
    }

    /**
     * 生成Android配置文件
     * 使用ConfigGenerator生成配置
     * @param dependencies 依赖列表
     * @param outputPath 输出路径
     * @return 是否成功
     */
    suspend fun generateAndroidConfig(dependencies: List<XCDependencyInfo>, outputPath: String): Boolean = withContext(Dispatchers.IO) {
        try {
            val configGenerator = ConfigGenerator()
            configGenerator.generateAndroidConfig(dependencies, outputPath)
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
    
    /**
     * 生成iOS配置文件
     * 使用ConfigGenerator生成配置
     * @param dependencies 依赖列表
     * @param outputPath 输出路径
     * @return 是否成功
     */
    suspend fun generateIosConfig(dependencies: List<XCDependencyInfo>, outputPath: String): Boolean = withContext(Dispatchers.IO) {
        try {
            val config = getConfig()
            val configGenerator = ConfigGenerator()
            configGenerator.generateIosConfig(dependencies, config.customPodMapping, outputPath)
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
}