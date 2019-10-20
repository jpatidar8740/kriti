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

public class booklist extends AppCompatActivity {
    Button video, courses, clubs;
    private RecyclerView recycler;
    private RecyclerView.Adapter adapter;
    private RecyclerView.LayoutManager layoutManager;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_booklist);


        recycler = findViewById(R.id.book);
        recycler.setHasFixedSize(true);

        layoutManager = new LinearLayoutManager(this);

        recycler.setLayoutManager(layoutManager);
        final List<courseItem> listcourse = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            List<video> tempvideo = new ArrayList<>();
            List<String> temptags = new ArrayList<>();
            String uid = "";
            String uploader = "";
            courseItem item = new courseItem("name", "Courses " + (i + 1), tempvideo, temptags, uid, uploader);
            listcourse.add(item);
        }
        adapter = new courseAdapter(booklist.this, listcourse);
        recycler.setAdapter(adapter);


        video = findViewById(R.id.videos);
        courses = findViewById(R.id.courses);

        video.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent i = new Intent(booklist.this, videolist.class);
                startActivity(i);
                finish();
            }
        });
        courses.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent i = new Intent(booklist.this, booklist.class);
                startActivity(i);
                finish();
            }
        });
    }
}