package com.example.kriti;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class videoAdapter extends RecyclerView.Adapter<videoAdapter.videoholder>{
    Context context;
    List<video> videoList;

    public videoAdapter(Context context, List<video> videoList) {
        this.context = context;
        this.videoList = videoList;
    }

    @NonNull
    @Override
    public videoholder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v=LayoutInflater.from(context).inflate(R.layout.itemlayout,parent,false);
        return new videoholder(v);


    }

    @Override
    public void onBindViewHolder(@NonNull videoholder holder, int position) {
        final video vid = videoList.get(position);
        String temp= vid.getTitle();
        holder.name.setText(temp);
        holder.parentlayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(vid.is_yt==true)
                {
                    Intent i=new Intent(context, playYouTube.class);
                    i.putExtra("video",vid.url);
                    context.startActivity(i);
                }
                else
                {
                    Intent i=new Intent(context, urlvideo.class);
                    i.putExtra("video",vid.url);
                    context.startActivity(i);
                }

            }
        });


    }

    @Override
    public int getItemCount() {

        return videoList.size();
    }

    public class videoholder extends RecyclerView.ViewHolder{
        TextView name;
        CardView parentlayout;

        public videoholder(@NonNull View itemView) {
            super(itemView);
            name=itemView.findViewById(R.id.name);
            parentlayout=itemView.findViewById(R.id.courseItem);

        }
    }

}
