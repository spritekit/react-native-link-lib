package com.reactnativelinklib

import java.io.File

/**
 * 配置文件生成器
 * 负责生成Android和iOS的配置文件
 */
class ConfigGenerator {

    companion object {
        private const val SETTINGS_GRADLE_HEADER = "// 由ReactNativeLinkLib自动生成的配置
// 请勿手动修改此文件

"
        private const val PODFILE_HEADER = "# 由ReactNativeLinkLib自动生成的配置
# 请勿手动修改此文件

"
    }

    /**
     * 生成Android settings.gradle配置
     * @param dependencies 依赖列表
     * @return 生成的配置内容
     */
    fun generateSettingsGradle(dependencies: List<DependencyManager.XCDependencyInfo>): String {
        val sb = StringBuilder(SETTINGS_GRADLE_HEADER)
        
        dependencies.forEach { dependency ->
            if (dependency.isLinked) {
                val packageName = dependency.name.replace("-", "_")
                sb.append("include ':${packageName}'").append("\n")
                sb.append("project(':${packageName}').projectDir = new File(rootProject.projectDir, '../node_modules/${dependency.name}/android')").append("\n\n")
            }
        }
        
        return sb.toString()
    }

    /**
     * 生成iOS Podfile配置
     * @param dependencies 依赖列表
     * @param customPodMapping 自定义Pod映射
     * @return 生成的配置内容
     */
    fun generatePodfile(dependencies: List<DependencyManager.XCDependencyInfo>, customPodMapping: Map<String, String>): String {
        val sb = StringBuilder(PODFILE_HEADER)
        
        dependencies.forEach { dependency ->
            if (dependency.isLinked) {
                val podName = customPodMapping[dependency.name] ?: dependency.podName ?: dependency.name
                sb.append("pod '${podName}', :path => '../node_modules/${dependency.name}'").append("\n")
            }
        }
        
        return sb.toString()
    }

    /**
     * 将配置内容写入文件
     * @param content 配置内容
     * @param filePath 文件路径
     * @return 是否成功
     */
    fun writeToFile(content: String, filePath: String): Boolean {
        return try {
            val file = File(filePath)
            // 确保父目录存在
            file.parentFile?.mkdirs()
            file.writeText(content)
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    /**
     * 生成Android配置文件
     * @param dependencies 依赖列表
     * @param outputPath 输出路径
     * @return 是否成功
     */
    fun generateAndroidConfig(dependencies: List<DependencyManager.XCDependencyInfo>, outputPath: String): Boolean {
        val content = generateSettingsGradle(dependencies)
        return writeToFile(content, outputPath)
    }

    /**
     * 生成iOS配置文件
     * @param dependencies 依赖列表
     * @param customPodMapping 自定义Pod映射
     * @param outputPath 输出路径
     * @return 是否成功
     */
    fun generateIosConfig(dependencies: List<DependencyManager.XCDependencyInfo>, customPodMapping: Map<String, String>, outputPath: String): Boolean {
        val content = generatePodfile(dependencies, customPodMapping)
        return writeToFile(content, outputPath)
    }
}