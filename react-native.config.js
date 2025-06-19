module.exports = {
  dependencies: {
    // 确保所有依赖都能正确自动链接
    '@react-native-async-storage/async-storage': {
      platforms: {
        android: {
          sourceDir: '../node_modules/@react-native-async-storage/async-storage/android/',
          packageImportPath: 'import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;',
        },
        ios: {
          podspecPath: '../node_modules/@react-native-async-storage/async-storage/RNCAsyncStorage.podspec',
        },
      },
    },
    '@react-native-picker/picker': {
      platforms: {
        android: {
          sourceDir: '../node_modules/@react-native-picker/picker/android/',
          packageImportPath: 'import com.reactnativecommunity.picker.RNCPickerPackage;',
        },
        ios: {
          podspecPath: '../node_modules/@react-native-picker/picker/RNCPicker.podspec',
        },
      },
    },
    '@shopify/flash-list': {
      platforms: {
        android: {
          sourceDir: '../node_modules/@shopify/flash-list/android/',
          packageImportPath: 'import com.shopify.reactnative.flash_list.ReactNativeFlashListPackage;',
        },
        ios: {
          podspecPath: '../node_modules/@shopify/flash-list/RNFlashList.podspec',
        },
      },
    },
    'react-native-audio-recorder-player': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-audio-recorder-player/android/',
          packageImportPath: 'import com.dooboolab.audiorecorderplayer.RNAudioRecorderPlayerPackage;',
        },
        ios: {
          podspecPath: '../node_modules/react-native-audio-recorder-player/RNAudioRecorderPlayer.podspec',
        },
      },
    },
    'react-native-fast-image': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-fast-image/android/',
          packageImportPath: 'import com.dylanvann.fastimage.FastImageViewPackage;',
        },
        ios: {
          podspecPath: '../node_modules/react-native-fast-image/RNFastImage.podspec',
        },
      },
    },
    'react-native-linear-gradient': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-linear-gradient/android/',
          packageImportPath: 'import com.BV.LinearGradient.LinearGradientPackage;',
        },
        ios: {
          podspecPath: '../node_modules/react-native-linear-gradient/BVLinearGradient.podspec',
        },
      },
    },
    'react-native-pager-view': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-pager-view/android/',
          packageImportPath: 'import com.reactnativepagerview.PagerViewPackage;',
        },
        ios: {
          podspecPath: '../node_modules/react-native-pager-view/react-native-pager-view.podspec',
        },
      },
    },
    'react-native-safe-area-context': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-safe-area-context/android/',
          packageImportPath: 'import com.th3rdwave.safeareacontext.SafeAreaContextPackage;',
        },
        ios: {
          podspecPath: '../node_modules/react-native-safe-area-context/react-native-safe-area-context.podspec',
        },
      },
    },
    'react-native-screens': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-screens/android/',
          packageImportPath: 'import com.swmansion.rnscreens.RNScreensPackage;',
        },
        ios: {
          podspecPath: '../node_modules/react-native-screens/RNScreens.podspec',
        },
      },
    },
    'react-native-svg': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-svg/android/',
          packageImportPath: 'import com.horcrux.svg.SvgPackage;',
        },
        ios: {
          podspecPath: '../node_modules/react-native-svg/RNSVG.podspec',
        },
      },
    },
    'react-native-video': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-video/android/',
          packageImportPath: 'import com.brentvatne.react.ReactVideoPackage;',
        },
        ios: {
          podspecPath: '../node_modules/react-native-video/react-native-video.podspec',
        },
      },
    },
    'react-native-view-shot': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-view-shot/android/',
          packageImportPath: 'import fr.greweb.reactnativeviewshot.RNViewShotPackage;',
        },
        ios: {
          podspecPath: '../node_modules/react-native-view-shot/react-native-view-shot.podspec',
        },
      },
    },
    'react-native-webview': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-webview/android/',
          packageImportPath: 'import com.reactnativecommunity.webview.RNCWebViewPackage;',
        },
        ios: {
          podspecPath: '../node_modules/react-native-webview/react-native-webview.podspec',
        },
      },
    },
  },
};