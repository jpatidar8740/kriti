package com.example.kriti;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class videolist extends AppCompatActivity {
    Button books, courses, clubs;
    private RecyclerView recycler;
    private RecyclerView.Adapter adapter;
    private RecyclerView.LayoutManager layoutManager;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_videolist);


        recycler = findViewById(R.id.video);
        recycler.setHasFixedSize(true);

        layoutManager = new LinearLayoutManager(this);

        recycler.setLayoutManager(layoutManager);

        final List<video> listcourse = new ArrayList<>();
        video item;
        item = new video(true,"Add Two Numbers(c++ code)","l-kNt5BrZTI");
        listcourse.add(item);
        item = new video(true,"Learn c++","yGB9jhsEsr8");
        listcourse.add(item);
        item = new video(true,"Basics of Machine Learning","ukzFI9rgwfU");
        listcourse.add(item);
        item = new video(true,"Learn AI","JMUxmLyrhSk");
        listcourse.add(item);
        item = new video(true,"Basics of Data Science","X3paOmcrTjQ");
        listcourse.add(item);
        item = new video(true,"Learn Data Science in 10 hours","-ETQ97mXXF0");
        listcourse.add(item);
        item = new video(true,"What's Chemistry?","4SbyQ9eVP7Q");
        listcourse.add(item);


        adapter = new videoAdapter(videolist.this, listcourse);
        recycler.setAdapter(adapter);


        books = findViewById(R.id.books);
        courses = findViewById(R.id.courses);

        books.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent i = new Intent(videolist.this, booklist.class);
                startActivity(i);
                finish();
            }
        });
        courses.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent i = new Intent(videolist.this, booklist.class);
                startActivity(i);
                finish();
            }
        });
    }
}
