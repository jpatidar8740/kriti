package com.example.kriti;

import java.util.List;

public class courseItem {
    public String coursename;
    public String description;
    public List<video> lectures;
    public List<String> tags;
    public String uid;
    public String uploader;


    public courseItem(String coursename, String description, List<video> lectures, List<String> tags, String uid, String uploader) {
        this.coursename = coursename;
        this.description = description;
        this.lectures = lectures;
        this.tags = tags;
        this.uid = uid;
        this.uploader = uploader;
    }

    public String getCoursename() {
        return coursename;
    }

    public String getDescription() {
        return description;
    }

    public List<video> getLectures() {
        return lectures;
    }

    public List<String> getTags() {
        return tags;
    }

    public String getUid() {
        return uid;
    }

    public String getUploader() {
        return uploader;
    }
}
