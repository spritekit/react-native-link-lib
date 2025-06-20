package com.reactnativelinklib

import android.content.Context
import android.content.pm.PackageManager
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * 库版本管理器
 * 提供库版本信息和依赖管理功能
 */
class LibraryVersionManager(private val context: Context) {

    /**
     * 库信息数据类
     */
    data class LibraryInfo(
        val name: String,
        val version: String,
        val isIntegrated: Boolean = true
    )
    
    // 使用Kotlin的懒加载初始化库信息映射
    private val libraryVersions by lazy {
        mapOf(
            "asyncStorage" to "1.17.11",
            "picker" to "2.4.8",
            "flashList" to "1.4.0",
            "audioRecorderPlayer" to "3.5.1",
            "fastImage" to "8.6.3",
            "fs" to "2.20.0",
            "linearGradient" to "2.6.2",
            "pagerView" to "6.1.2",
            "safeAreaContext" to "4.5.0",
            "screens" to "3.20.0",
            "svg" to "13.8.0",
            "update" to "1.0.0",
            "video" to "5.2.1",
            "viewShot" to "3.6.0",
            "webview" to "11.26.1"
        )
    }
    
    /**
     * 获取所有库信息
     */
    fun getAllLibraryInfo(): List<LibraryInfo> {
        return libraryVersions.map { (name, version) ->
            LibraryInfo(name, version)
        }
    }
    
    /**
     * 获取特定库的信息
     */
    fun getLibraryInfo(libraryName: String): LibraryInfo? {
        val version = libraryVersions[libraryName] ?: return null
        return LibraryInfo(libraryName, version)
    }
    
    /**
     * 检查库是否已集成
     */
    fun isLibraryIntegrated(libraryName: String): Boolean {
        return libraryVersions.containsKey(libraryName)
    }
    
    /**
     * 获取应用版本信息
     */
    suspend fun getAppVersionInfo(): Map<String, String> = withContext(Dispatchers.IO) {
        try {
            val packageInfo = context.packageManager.getPackageInfo(context.packageName, 0)
            mapOf(
                "versionName" to packageInfo.versionName,
                "versionCode" to packageInfo.versionCode.toString(),
                "packageName" to packageInfo.packageName
            )
        } catch (e: PackageManager.NameNotFoundException) {
            mapOf(
                "error" to "无法获取应用版本信息"
            )
        }
    }
    
    /**
     * 获取库的依赖关系
     */
    fun getLibraryDependencies(libraryName: String): List<String> {
        // 模拟依赖关系
        return when (libraryName) {
            "fastImage" -> listOf("glide")
            "video" -> listOf("exoplayer")
            "webview" -> listOf("androidx.webkit")
            else -> emptyList()
        }
    }
    
    /**
     * 比较两个版本号
     * 使用VersionUtils进行版本比较
     * @param version1 版本号1
     * @param version2 版本号2
     * @return 如果version1 > version2返回正数，小于返回负数，相等返回0
     */
    fun compareVersions(version1: String, version2: String): Int {
        return VersionUtils.compareVersions(version1, version2)
    }
    
    /**
     * 检查版本是否在指定范围内
     * @param version 要检查的版本
     * @param minVersion 最小版本（包含）
     * @param maxVersion 最大版本（不包含），如果为null则不检查上限
     * @return 是否在范围内
     */
    fun isVersionInRange(version: String, minVersion: String, maxVersion: String? = null): Boolean {
        return VersionUtils.isVersionInRange(version, minVersion, maxVersion)
    }
}