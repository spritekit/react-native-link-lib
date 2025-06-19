# React Native Link Lib - ProGuard Rules
# 保持React Native相关类不被混淆

# React Native核心
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# React Native Bridge
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

# AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Fast Image
-keep class com.dylanvann.fastimage.** { *; }
-keep class com.bumptech.glide.** { *; }

# Audio Recorder Player
-keep class com.dooboolab.audiorecorderplayer.** { *; }

# React Native Video
-keep class com.brentvatne.react.** { *; }

# React Native WebView
-keep class com.reactnativecommunity.webview.** { *; }

# React Native SVG
-keep class com.horcrux.svg.** { *; }

# React Native Linear Gradient
-keep class com.BV.LinearGradient.** { *; }

# React Native Safe Area Context
-keep class com.th3rdwave.safeareacontext.** { *; }

# React Native Screens
-keep class com.swmansion.rnscreens.** { *; }

# FlashList
-keep class com.shopify.reactnative.flash_list.** { *; }

# React Native File System
-keep class com.rnfs.** { *; }

# React Native Picker
-keep class com.reactnativecommunity.picker.** { *; }

# React Native Pager View
-keep class com.reactnativepagerview.** { *; }

# React Native View Shot
-keep class fr.greweb.reactnativeviewshot.** { *; }

# React Native Popover View
-keep class com.reactnativepopoverview.** { *; }

# React Native Update
-keep class com.reactnativeupdate.** { *; }

# 保持所有native方法
-keepclasseswithmembernames class * {
    native <methods>;
}

# 保持枚举类
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# 保持Serializable类
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# 保持Parcelable类
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
-dontwarn org.conscrypt.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase

# Glide
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
    **[] $VALUES;
    public *;
}

# 保持注解
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes SourceFile,LineNumberTable