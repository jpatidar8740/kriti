package com.example.kriti;

public class video {
    boolean is_yt;
    public String title;
    public String url;

    public video(boolean is_yt, String title, String url) {
        this.is_yt = is_yt;
        this.title = title;
        this.url = url;
    }

    public boolean isIs_yt() {
        return is_yt;
    }

    public String getTitle() {
        return title;
    }

    public String getUrl() {
        return url;
    }
}
