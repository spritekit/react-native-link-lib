package com.reactnativelinklib

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.File

/**
 * 依赖扫描器
 * 负责扫描项目中的React Native依赖
 */
class DependencyScanner {

    companion object {
        private const val NODE_MODULES = "node_modules"
        private const val PACKAGE_JSON = "package.json"
        private const val PODSPEC_EXTENSION = ".podspec"
    }

    /**
     * 扫描项目中的React Native依赖
     * @param projectPath 项目路径
     * @return 依赖列表
     */
    suspend fun scanDependencies(projectPath: String): List<DependencyManager.XCDependencyInfo> = withContext(Dispatchers.IO) {
        val dependencies = mutableListOf<DependencyManager.XCDependencyInfo>()
        val nodeModulesDir = File(projectPath, NODE_MODULES)
        
        if (!nodeModulesDir.exists() || !nodeModulesDir.isDirectory) {
            return@withContext dependencies
        }
        
        // 扫描直接依赖
        scanDirectDependencies(nodeModulesDir, dependencies)
        
        // 扫描@react-native-community目录
        scanCommunityDependencies(nodeModulesDir, dependencies)
        
        return@withContext dependencies
    }

    /**
     * 扫描直接依赖
     * @param nodeModulesDir node_modules目录
     * @param dependencies 依赖列表
     */
    private suspend fun scanDirectDependencies(nodeModulesDir: File, dependencies: MutableList<DependencyManager.XCDependencyInfo>) = withContext(Dispatchers.IO) {
        nodeModulesDir.listFiles()?.forEach { file ->
            if (file.isDirectory && file.name.startsWith("react-native-")) {
                val packageInfo = parsePackageJson(file)
                if (packageInfo != null) {
                    dependencies.add(packageInfo)
                }
            }
        }
    }

    /**
     * 扫描@react-native-community目录
     * @param nodeModulesDir node_modules目录
     * @param dependencies 依赖列表
     */
    private suspend fun scanCommunityDependencies(nodeModulesDir: File, dependencies: MutableList<DependencyManager.XCDependencyInfo>) = withContext(Dispatchers.IO) {
        val communityDir = File(nodeModulesDir, "@react-native-community")
        if (communityDir.exists() && communityDir.isDirectory) {
            communityDir.listFiles()?.forEach { file ->
                if (file.isDirectory) {
                    val packageInfo = parsePackageJson(file, true)
                    if (packageInfo != null) {
                        dependencies.add(packageInfo)
                    }
                }
            }
        }
    }

    /**
     * 解析package.json文件
     * @param packageDir 包目录
     * @param isCommunity 是否是社区包
     * @return 依赖信息
     */
    private fun parsePackageJson(packageDir: File, isCommunity: Boolean = false): DependencyManager.XCDependencyInfo? {
        val packageJsonFile = File(packageDir, PACKAGE_JSON)
        if (!packageJsonFile.exists()) {
            return null
        }
        
        try {
            val jsonContent = packageJsonFile.readText()
            val json = JSONObject(jsonContent)
            
            val name = if (isCommunity) {
                "@react-native-community/${packageDir.name}"
            } else {
                json.optString("name", packageDir.name)
            }
            
            val version = json.optString("version", "")
            val podName = findPodspecName(packageDir)
            val hasAndroidDir = File(packageDir, "android").exists()
            val hasIosDir = File(packageDir, "ios").exists()
            
            return DependencyManager.XCDependencyInfo(
                name = name,
                version = version,
                podName = podName,
                isLinked = hasAndroidDir || hasIosDir
            )
        } catch (e: Exception) {
            e.printStackTrace()
            return null
        }
    }

    /**
     * 查找podspec文件名
     * @param packageDir 包目录
     * @return podspec名称
     */
    private fun findPodspecName(packageDir: File): String? {
        packageDir.listFiles()?.forEach { file ->
            if (file.isFile && file.name.endsWith(PODSPEC_EXTENSION)) {
                return file.name.substring(0, file.name.length - PODSPEC_EXTENSION.length)
            }
        }
        return null
    }
}