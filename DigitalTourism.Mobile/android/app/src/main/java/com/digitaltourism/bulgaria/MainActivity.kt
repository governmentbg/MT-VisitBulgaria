package com.digitaltourism.bulgaria

import android.content.Intent
import android.os.Bundle
import com.zoontek.rnbootsplash.RNBootSplash
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "VisitBulgaria"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    RNBootSplash.init(this, R.style.BootTheme) // initialize the splash screen
    super.onCreate(savedInstanceState) // super.onCreate(null) with react-native-screens
  }

  /**
   * Forward new intents (deep links delivered to an already-running singleTask
   * instance) to React Native's Linking module. Required by React Navigation
   * linking with `launchMode="singleTask"`; without this, HTTPS deep links
   * arriving while the app is already running wouldn't reach the JS layer.
   */
  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
  }
}
