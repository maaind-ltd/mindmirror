package com.mindmirror;

import android.app.Activity;
import android.os.Bundle;

import androidx.annotation.Nullable;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "MindMirror";
  }

public static class MindMirrorActivityDelegate extends ReactActivityDelegate {
    private static final String TARGET_SCREEN = "target_screen";
    private Bundle mInitialProps = null;
    private final
    @Nullable
    Activity mActivity;

    public MindMirrorActivityDelegate(Activity activity, String mainComponentName) {
        super(activity, mainComponentName);
        this.mActivity = activity;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Bundle bundle = mActivity.getIntent().getExtras();
         if (bundle != null && bundle.containsKey(TARGET_SCREEN)) {
            mInitialProps = new Bundle();
            mInitialProps.putString(TARGET_SCREEN, "voice-check-in");// bundle.getString(TARGET_SCREEN));
         }
        super.onCreate(savedInstanceState);
    }

    @Override
    protected Bundle getLaunchOptions() {
        return mInitialProps;
    }
}

@Override
protected ReactActivityDelegate createReactActivityDelegate() {
    return new MindMirrorActivityDelegate(this, getMainComponentName());
  }
}
