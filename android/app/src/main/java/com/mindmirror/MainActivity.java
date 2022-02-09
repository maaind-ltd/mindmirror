package com.mindmirror;

import android.app.Activity;
import android.os.Bundle;

import androidx.annotation.Nullable;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.spotify.sdk.android.auth.AuthorizationClient;
import com.spotify.sdk.android.auth.AuthorizationRequest;
import com.spotify.sdk.android.auth.AuthorizationResponse;

public class MainActivity extends ReactActivity {

    private static final int REQUEST_CODE = 1337;
    private static final String REDIRECT_URI = "com.mindmirror://callback";

    AuthorizationRequest.Builder builder =
            new AuthorizationRequest.Builder(CLIENT_ID, AuthorizationResponse.Type.TOKEN, REDIRECT_URI);

    builder.setScopes(new String[]{"streaming"});
        AuthorizationRequest request = builder.build();

    AuthorizationClient.openLoginActivity(this, REQUEST_CODE, request);
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "MindMirror";
  }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.mind_mirror);
    }

    @Override
    protected void onStart() {
        super.onStart();
        // We will start writing our code here.
    }

    private void connected() {
        // Then we will write some more code here.
    }

    @Override
    protected void onStop() {
        super.onStop();
        // Aaand we will finish off here.
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
