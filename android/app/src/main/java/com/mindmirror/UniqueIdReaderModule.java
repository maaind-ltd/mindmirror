package com.mindmirror;

import android.os.Handler;
import android.provider.Settings;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.spotify.android.appremote.api.AppRemote;
import com.spotify.sdk.android.auth.AuthorizationClient;
import com.spotify.sdk.android.auth.AuthorizationRequest;
import com.spotify.sdk.android.auth.AuthorizationResponse;

import android.provider.Settings;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLSession;
import java.net.URL;

import com.spotify.android.appremote.api.ConnectionParams;
import com.spotify.android.appremote.api.Connector;
import com.spotify.android.appremote.api.SpotifyAppRemote;

import com.spotify.protocol.client.Subscription;
import com.spotify.protocol.types.PlayerState;
import com.spotify.protocol.types.Track;

public class UniqueIdReaderModule extends ReactContextBaseJavaModule {
    private static final int REQUEST_CODE = 1337;
    private static final String REDIRECT_URI = "com.mindmirror://callback";
    private static final String CLIENT_ID = "00e4806b0bb742a9a187df9ca1ac0a6a";
    private ReactApplicationContext nativeContext;
    private SpotifyAppRemote mSpotifyAppRemote;

    private String androidId;
    UniqueIdReaderModule(ReactApplicationContext context) {
        super(context);
        nativeContext = context;
        this.androidId = Settings.Secure.getString(context.getContentResolver(),
                Settings.Secure.ANDROID_ID);
    }

    // add to CalendarModule.java
    @Override
    public String getName() {
        return "UniqueIdReader";
    }


    @ReactMethod
    public void performPostRequest(String urlStr, String jsonData, Callback cb) {
        Thread thread = new Thread() {
            @Override
            public void run() {
                try {
                    URL url = new URL(urlStr);
                    // Don't verify host names
                    HostnameVerifier hv = new HostnameVerifier() {
                        public boolean verify(String urlHostName, SSLSession session) {
                            return true;
                        }
                    };
                    HttpsURLConnection.setDefaultHostnameVerifier(hv);
                    HttpsURLConnection con = (HttpsURLConnection)url.openConnection();
                    con.setRequestMethod("POST");
                    con.setRequestProperty("Content-Type", "application/json; utf-8");
                    con.setRequestProperty("Accept", "application/json");
                    con.setDoOutput(true);
                    OutputStream os = con.getOutputStream();
                    byte[] input = jsonData.getBytes("utf-8");
                    os.write(input, 0, input.length);

                    BufferedReader br = new BufferedReader(
                            new InputStreamReader(con.getInputStream(), "utf-8"));
                    StringBuilder response = new StringBuilder();
                    String responseLine = null;
                    while ((responseLine = br.readLine()) != null) {
                        response.append(responseLine.trim());
                    }
                    cb.invoke(null, response.toString());
                    // cb.invoke(null, "Finished call.");
                } catch (Exception e) {
                    cb.invoke(e.toString(), null);
                }
            }
        };

        thread.start();
    }

    @ReactMethod
    public void getUniqueId(Callback cb) {
        try {
            cb.invoke(null, this.androidId);
        } catch (Exception e) {
            cb.invoke(e.toString(), null);
        }
    }

    @ReactMethod
    public void startSpotifyAuthentication(Callback cb) {
        AuthorizationRequest.Builder builder =
                new AuthorizationRequest.Builder(CLIENT_ID, AuthorizationResponse.Type.TOKEN, REDIRECT_URI);

        builder.setScopes(new String[]{"streaming","app-remote-control"});
            AuthorizationRequest request = builder.build();

        AuthorizationClient.openLoginInBrowser(this.nativeContext.getCurrentActivity(), request);

        Handler handler=new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {

                if (MainActivity.connectionSuccessful) {
                    cb.invoke("Finished authorization", null);
                } else {
                    handler.postDelayed(this, 1000);
                }
            }
        },1000);
    }


    @ReactMethod
    public void startSpotifyPlaylist(Callback cb) {
        MainActivity.spotifyPlaybackResult = "Starting playback call";

        ConnectionParams connectionParams =
            new ConnectionParams.Builder(CLIENT_ID)
                .setRedirectUri(REDIRECT_URI)
                .showAuthView(true)
                .build();

        SpotifyAppRemote.connect(this.nativeContext.getCurrentActivity(), connectionParams,
            new Connector.ConnectionListener() {

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
        AuthorizationRequest.Builder builder =
                new AuthorizationRequest.Builder(CLIENT_ID, AuthorizationResponse.Type.TOKEN, REDIRECT_URI);

        builder.setScopes(new String[]{"streaming","app-remote-control"});
        AuthorizationRequest request = builder.build();

        AuthorizationClient.openLoginInBrowser(this.nativeContext.getCurrentActivity(), request);
    }


    @ReactMethod
    public void getSpotifyToken(Callback cb) {
        cb.invoke(MainActivity.spotifyConnectionResult, null);
    }

    @ReactMethod
    public void getSpotifyMessage(Callback cb) {
        cb.invoke("connection: " + MainActivity.spotifyConnectionResult + ", playbackresult: " + MainActivity.spotifyPlaybackResult, null);
    }
}
