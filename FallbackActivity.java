package com.nkhuku.app;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * FallbackActivity
 * Shown when Chrome is not installed or is too old to support TWA.
 * Offers the user a button to open the app in their default browser.
 */
public class FallbackActivity extends Activity {

    private static final String APP_URL = "https://nkhuku.netlify.app";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Build simple layout programmatically — no XML needed
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setGravity(Gravity.CENTER);
        layout.setBackgroundColor(0xFF080a0d);
        layout.setPadding(64, 64, 64, 64);

        TextView title = new TextView(this);
        title.setText("Nkhuku");
        title.setTextColor(0xFFf5a623);
        title.setTextSize(28);
        title.setGravity(Gravity.CENTER);

        TextView msg = new TextView(this);
        msg.setText("Please update Chrome to version 72 or later to use this app, or tap below to open in your browser.");
        msg.setTextColor(0xFFAAAAAA);
        msg.setTextSize(14);
        msg.setGravity(Gravity.CENTER);
        msg.setPadding(0, 32, 0, 48);

        Button btn = new Button(this);
        btn.setText("Open in Browser");
        btn.setBackgroundColor(0xFFf5a623);
        btn.setTextColor(0xFF000000);
        btn.setPadding(48, 24, 48, 24);
        btn.setOnClickListener(v -> {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(APP_URL));
            startActivity(intent);
        });

        layout.addView(title);
        layout.addView(msg);
        layout.addView(btn);

        setContentView(layout);
    }
}
