package com.example.kriti;

import android.app.ProgressDialog;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;
import android.widget.MediaController;
import android.widget.VideoView;

import androidx.appcompat.app.AppCompatActivity;

public class urlvideo extends AppCompatActivity {

    VideoView video;
    ProgressDialog pd;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_urlvideo);
        Bundle bundle=getIntent().getExtras();
        String url=bundle.getString("video");

        video=findViewById(R.id.urlvideo);
        pd=new ProgressDialog(urlvideo.this);
        pd.setMessage("Please Wait...");
        pd.show();
        Uri uri= Uri.parse(url);
        video.setVideoURI(uri);
        MediaController vidcontrol=new MediaController(urlvideo.this);
        vidcontrol.setAnchorView(video);
        video.setMediaController(vidcontrol);

        video.start();
        video.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
            @Override
            public void onPrepared(MediaPlayer mp) {
                pd.dismiss();
            }
        });

    }
}
