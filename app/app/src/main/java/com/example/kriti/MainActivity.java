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

public class MainActivity extends AppCompatActivity {
    Button video,book,profile;
    private RecyclerView recycler;
    private RecyclerView.Adapter adapter;
    private RecyclerView.LayoutManager layoutManager;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        recycler=findViewById(R.id.course);
        recycler.setHasFixedSize(true);

        layoutManager = new LinearLayoutManager(this);

        recycler.setLayoutManager(layoutManager);
        final List<courseItem> listcourse=new ArrayList<>();
        for (int i=0;i<10;i++)
        {
            List<video> tempvideo=new ArrayList<>();
            List<String> temptags=new ArrayList<>();
            String uid="";
            String uploader ="";
            courseItem item =new courseItem("name","Courses "+(i+1),tempvideo,temptags,uid,uploader);
            listcourse.add(item);
        }
        adapter =new courseAdapter(MainActivity.this,listcourse);
        recycler.setAdapter(adapter);


        video=findViewById(R.id.videos);
        book=findViewById(R.id.books);

        video.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent i=new Intent(MainActivity.this,videolist.class);
                startActivity(i);
                finish();
            }
        });
        book.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent i=new Intent(MainActivity.this,booklist.class);
                startActivity(i);
                finish();
            }
        });

    }
}
