package com.mindmirror;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.widget.RemoteViews;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Random;

/**
 * Implementation of App Widget functionality.
 */
public class MindMirrorWidget extends AppWidgetProvider {

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager,
                                int appWidgetId) {

        CharSequence widgetText = context.getString(R.string.appwidget_text);
        // Construct the RemoteViews object
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.mind_mirror);


        try {
            SharedPreferences sharedPref = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
            String appString = sharedPref.getString("appData", "{\"name\":'No measured mood', \"colors\": [214, 214, 214]}");
            JSONObject appData = new JSONObject(appString);
            String moodName = appData.getString("name");
//            JSONArray colors = appData.getJSONArray("colors");

            views.setTextViewText(R.id.textView, moodName);
//            int bgColor = Color.argb(255, colors.getInt(0), colors.getInt(1), colors.getInt(2));

            switch (moodName) {
                case "GoGoGo":
                    views.setInt(R.id.imageView, "setBackgroundResource", R.drawable.layout_ring_gogogo);
                    views.setInt(R.id.coloredLinearLayout, "setBackgroundResource", R.drawable.layout_gogogo);
                    break;
                case "Mellow":
                    views.setInt(R.id.imageView, "setBackgroundResource", R.drawable.layout_ring_mellow);
                    views.setInt(R.id.coloredLinearLayout, "setBackgroundResource", R.drawable.layout_mellow);
                    break;
                case "Flow":
                    views.setInt(R.id.imageView, "setBackgroundResource", R.drawable.layout_ring_flow);
                    views.setInt(R.id.coloredLinearLayout, "setBackgroundResource", R.drawable.layout_flow);
                    break;
                case "No measured mood":
                    views.setInt(R.id.imageView, "setBackgroundResource", R.drawable.layout_ring_no_emotion);
                    views.setInt(R.id.coloredLinearLayout, "setBackgroundResource", R.drawable.layout_no_emotion);
                    break;
            }

        } catch (JSONException e) {
            views.setTextViewText(R.id.textView, e.getLocalizedMessage());
        }

        Intent voiceCheckinIntent = new Intent(context, MainActivity.class);
        voiceCheckinIntent.putExtra("target_screen", "voice-check-in");

        PendingIntent voiceCheckinPendingIntent = PendingIntent.getActivity(context, 0, voiceCheckinIntent, 0);

        views.setOnClickPendingIntent(R.id.imageView, voiceCheckinPendingIntent);

        Intent mirrorScreenIntent = new Intent(context, MainActivity.class);

        PendingIntent mirrorScreenPendingIntent = PendingIntent.getActivity(context, 0, mirrorScreenIntent, 0);

        views.setOnClickPendingIntent(R.id.WidgetLayout, mirrorScreenPendingIntent);

        // Instruct the widget manager to update the widget
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // There may be multiple widgets active, so update all of them
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    @Override
    public void onEnabled(Context context) {
        // Enter relevant functionality for when the first widget is created
    }

    @Override
    public void onDisabled(Context context) {
        // Enter relevant functionality for when the last widget is disabled
    }
}