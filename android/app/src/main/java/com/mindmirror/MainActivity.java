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
//
//    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
//        super.onActivityResult(requestCode, resultCode, intent);
//
//        // Check if result comes from the correct activity
//        if (requestCode == 1337) {
//            AuthorizationResponse response = AuthorizationClient.getResponse(resultCode, intent);
//            switch (response.getType()) {
//                // Response was successful and contains auth token
//                case TOKEN:
//                    MainActivity.connectionSuccessful = true;
//                    MainActivity.spotifyConnectionResult = "Success!";
//                    // Handle successful response
//                    ConnectionParams connectionParams =
//                            new ConnectionParams.Builder(CLIENT_ID)
//                                    .setRedirectUri(REDIRECT_URI)
//                                    .showAuthView(true)
//                                    .build();
//
//                    SpotifyAppRemote.connect(this, connectionParams, new Connector.ConnectionListener() {
//
//                                @Override
//                                public void onConnected(SpotifyAppRemote spotifyAppRemote) {
//                                    mSpotifyAppRemote = spotifyAppRemote;
//                                    Log.d("MindMirrorSpotify", "Connected! Yay!");
//
//                                    MainActivity.spotifyPlaybackResult = "Connected! Yay!";
//                                    // Now you can start interacting with App Remote
//
//                                    mSpotifyAppRemote.getPlayerApi().play("spotify:playlist:37i9dQZF1DX2sUQwD7tbmL");
//                                }
//
//                                @Override
//                                public void onFailure(Throwable throwable) {
//                                    Log.e("MindMirrorSpotify", throwable.getMessage(), throwable);
//
//                                    MainActivity.spotifyPlaybackResult = throwable.getMessage();
//
//                                    // Something went wrong when attempting to connect! Handle errors here
//                                }
//                            });
//                    break;
//
//                // Auth flow returned an error
//                case ERROR:
//                    MainActivity.connectionSuccessful = false;
//                    MainActivity.spotifyConnectionResult = "Error!" + response.getError();
//                    // Handle error response
//                    break;
//
//                // Most likely auth flow was cancelled
//                default:
//                    MainActivity.spotifyConnectionResult = "Unknown!";
//                    // Handle other cases
//            }
//        }
//    }

    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);

        Uri uri = intent.getData();
        if (uri != null) {
            AuthorizationResponse response = AuthorizationResponse.fromUri(uri);

            switch (response.getType()) {
                case TOKEN:
                    MainActivity.spotifyConnectionResult = "Token:" + response.getAccessToken();
//                    MainActivity.spotifyApiToken = response.getAccessToken();
                    // Handle successful response
                    // Handle successful response
                    ConnectionParams connectionParams =
                            new ConnectionParams.Builder(CLIENT_ID)
                                    .setRedirectUri(REDIRECT_URI)
                                    .showAuthView(true)
                                    .build();

                    SpotifyAppRemote.connect(this, connectionParams, new Connector.ConnectionListener() {

                        @Override
                        public void onConnected(SpotifyAppRemote spotifyAppRemote) {
                            mSpotifyAppRemote = spotifyAppRemote;
                            Log.d("MindMirrorSpotify", "Connected! Yay!");

                            MainActivity.spotifyPlaybackResult = "Connected! Yay!";
                            // Now you can start interacting with App Remote

                            mSpotifyAppRemote.getPlayerApi().play("spotify:playlist:37i9dQZF1DX2sUQwD7tbmL");
                        }

                        @Override
                        public void onFailure(Throwable throwable) {
                            Log.e("MindMirrorSpotify", throwable.getMessage(), throwable);

                            MainActivity.spotifyPlaybackResult = throwable.getMessage();

                            // Something went wrong when attempting to connect! Handle errors here
                        }
                    });
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
