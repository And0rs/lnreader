package expo.modules.nativereadercontrols

import android.content.Context
import android.media.AudioManager
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class NativeReaderControlsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NativeReaderControls")

    Function("adjustVolume") { direction: Int ->
      val audioManager = appContext.reactContext?.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
      audioManager?.adjustStreamVolume(
        AudioManager.STREAM_MUSIC,
        if (direction > 0) AudioManager.ADJUST_RAISE else AudioManager.ADJUST_LOWER,
        0
      )
    }

    Function("adjustBrightness") { direction: Int ->
      val activity = appContext.currentActivity ?: return@Function
      activity.runOnUiThread {
        val window = activity.window
        val attributes = window.attributes
        // Keep brightness local to the app window; changing the system setting needs special permission.
        val current = if (attributes.screenBrightness >= 0f) {
          attributes.screenBrightness
        } else {
          try {
            Settings.System.getInt(
              activity.contentResolver,
              Settings.System.SCREEN_BRIGHTNESS,
              128
            ) / 255f
          } catch (_: SecurityException) {
            0.5f
          }
        }
        val delta = if (direction > 0) 0.1f else -0.1f
        attributes.screenBrightness = (current + delta).coerceIn(0.01f, 1f)
        window.attributes = attributes
      }
    }
  }
}
