package com.reactnativelinklib

/**
 * 版本工具类
 * 提供版本比较等功能
 */
object VersionUtils {

    /**
     * 比较两个版本号
     * @param version1 版本号1
     * @param version2 版本号2
     * @return 如果version1 > version2返回1，如果version1 < version2返回-1，如果相等返回0
     */
    fun compareVersions(version1: String, version2: String): Int {
        if (version1 == version2) return 0
        
        val v1Components = parseVersion(version1)
        val v2Components = parseVersion(version2)
        
        // 比较主要版本号部分
        for (i in 0 until minOf(v1Components.size, v2Components.size)) {
            val diff = v1Components[i].compareTo(v2Components[i])
            if (diff != 0) return diff
        }
        
        // 如果前面的版本号都相同，比较版本号数组的长度
        return v1Components.size.compareTo(v2Components.size)
    }
    
    /**
     * 解析版本号字符串为数字数组
     * @param version 版本号字符串，如"1.2.3-beta.1"
     * @return 版本号数字数组
     */
    private fun parseVersion(version: String): List<Int> {
        // 移除预发布标识符（如-beta.1）
        val mainVersion = version.split("-")[0]
        
        // 分割版本号并转换为整数
        return mainVersion.split(".").mapNotNull { component ->
            try {
                component.toInt()
            } catch (e: NumberFormatException) {
                null
            }
        }
    }
    
    /**
     * 检查版本是否在指定范围内
     * @param version 要检查的版本
     * @param minVersion 最小版本（包含）
     * @param maxVersion 最大版本（不包含），如果为null则不检查上限
     * @return 是否在范围内
     */
    fun isVersionInRange(version: String, minVersion: String, maxVersion: String? = null): Boolean {
        val compareWithMin = compareVersions(version, minVersion)
        if (compareWithMin < 0) return false
        
        if (maxVersion != null) {
            val compareWithMax = compareVersions(version, maxVersion)
            if (compareWithMax >= 0) return false
        }
        
        return true
    }
    
    /**
     * 获取语义化版本的主要版本号
     * @param version 完整版本号，如"1.2.3"
     * @return 主要版本号，如"1"
     */
    fun getMajorVersion(version: String): String {
        val components = parseVersion(version)
        return if (components.isNotEmpty()) components[0].toString() else ""
    }
    
    /**
     * 获取语义化版本的次要版本号
     * @param version 完整版本号，如"1.2.3"
     * @return 次要版本号，如"2"
     */
    fun getMinorVersion(version: String): String {
        val components = parseVersion(version)
        return if (components.size > 1) components[1].toString() else ""
    }
    
    /**
     * 获取语义化版本的补丁版本号
     * @param version 完整版本号，如"1.2.3"
     * @return 补丁版本号，如"3"
     */
    fun getPatchVersion(version: String): String {
        val components = parseVersion(version)
        return if (components.size > 2) components[2].toString() else ""
    }
}