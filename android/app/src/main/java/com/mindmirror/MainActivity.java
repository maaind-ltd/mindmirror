package com.mindmirror;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.spotify.android.appremote.api.ConnectionParams;
import com.spotify.android.appremote.api.Connector;
import com.spotify.android.appremote.api.SpotifyAppRemote;
import com.spotify.sdk.android.auth.AuthorizationClient;
import com.spotify.sdk.android.auth.AuthorizationResponse;

public class MainActivity extends ReactActivity {

    private static final int REQUEST_CODE = 1337;
    private static final String REDIRECT_URI = "com.mindmirror://callback";
    private static final String CLIENT_ID = "00e4806b0bb742a9a187df9ca1ac0a6a";

    public static String spotifyPlaybackResult = "None yet";
    static Boolean connectionSuccessful = false;
    public static String spotifyConnectionResult = "Unset";
    public static String spotifyApiToken = "";
    private SpotifyAppRemote mSpotifyAppRemote;

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


    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);

        Uri uri = intent.getData();
        if (uri != null) {
            AuthorizationResponse response = AuthorizationResponse.fromUri(uri);

            switch (response.getType()) {
                case TOKEN:
                    MainActivity.spotifyConnectionResult = "Token:" + response.getAccessToken();
                    break;

                // Auth flow returned an error
                case ERROR:
                    MainActivity.spotifyConnectionResult = "Error!" + response.getError();
                    // Handle error response
                    break;

                // Most likely auth flow was cancelled
                default:
                    MainActivity.spotifyConnectionResult = "Unknown!";
                    // Handle other cases
            }
        }
    }
}
