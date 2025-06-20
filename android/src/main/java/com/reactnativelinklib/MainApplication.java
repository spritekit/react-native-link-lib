package com.reactnativelinklib;

import android.app.Application;
import android.content.Context;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.config.ReactFeatureFlags;
import com.facebook.soloader.SoLoader;

// React Native 第三方库导入
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.picker.RNCPickerPackage;
import com.shopify.reactnative.flash_list.ReactNativeFlashListPackage;
import com.rnaudiorecorderplayer.RNAudioRecorderPlayerPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.rnfs.RNFSPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.reactnativepagerview.PagerViewPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.horcrux.svg.SvgPackage;
import com.reactnativecommunity.rnupdate.RNUpdatePackage;
import com.brentvatne.react.ReactVideoPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

/**
 * React Native Link Lib - 主应用程序类
 * 配置所有React Native第三方库的包注册
 */
public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost =
            new ReactNativeHost(this) {
                @Override
                public boolean getUseDeveloperSupport() {
                    return BuildConfig.DEBUG;
                }

                @Override
                protected List<ReactPackage> getPackages() {
                    @SuppressWarnings("UnnecessaryLocalVariable")
                    List<ReactPackage> packages = new PackageList(this).getPackages();
                    
                    // 手动添加第三方库包
                    packages.add(new AsyncStoragePackage());
                    packages.add(new RNCPickerPackage());
                    packages.add(new ReactNativeFlashListPackage());
                    packages.add(new RNAudioRecorderPlayerPackage());
                    packages.add(new FastImageViewPackage());
                    packages.add(new RNFSPackage());
                    packages.add(new LinearGradientPackage());
                    packages.add(new PagerViewPackage());
                    packages.add(new SafeAreaContextPackage());
                    packages.add(new RNScreensPackage());
                    packages.add(new SvgPackage());
                    packages.add(new RNUpdatePackage());
                    packages.add(new ReactVideoPackage());
                    packages.add(new RNViewShotPackage());
                    packages.add(new RNCWebViewPackage());
                    
                    // 添加自定义模块包
                    packages.add(new ReactNativeLinkLibPackage());
                    packages.add(new ReactNativeLinkLibPackageKt());
                    
                    return packages;
                }

                @Override
                protected String getJSMainModuleName() {
                    return "index";
                }
            };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    }

    /**
     * Loads Flipper in React Native templates. Call this in the onCreate method with something like
     * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
     *
     * @param context
     * @param reactInstanceManager
     */
    private static void initializeFlipper(
            Context context, ReactInstanceManager reactInstanceManager) {
        if (BuildConfig.DEBUG) {
            try {
                /*
                 We use reflection here to pick up the class that initializes Flipper,
                since Flipper library is not available in release mode
                */
                Class<?> aClass = Class.forName("com.reactnativelinklib.ReactNativeFlipper");
                aClass
                        .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
                        .invoke(null, context, reactInstanceManager);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            } catch (NoSuchMethodException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            }
        }
    }
}