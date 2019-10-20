package com.example.kriti;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class courseAdapter extends RecyclerView.Adapter<courseAdapter.courseholder>{
    Context context;
    List<courseItem> courseItems;

    public courseAdapter(Context context, List<courseItem> courseItems) {
        this.context = context;
        this.courseItems = courseItems;
    }

    @NonNull
    @Override
    public courseholder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v=LayoutInflater.from(context).inflate(R.layout.itemlayout,parent,false);
        return new courseholder(v);


    }

    @Override
    public void onBindViewHolder(@NonNull courseholder holder, int position) {
        courseItem courseItem = courseItems.get(position);
        String temp= courseItem.getCoursename()+" "+"|"+" "+ courseItem.getCoursename();
        holder.name.setText(temp);
        holder.parentlayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

            }
        });


    }

    @Override
    public int getItemCount() {
        return 0;
    }

    public class courseholder extends RecyclerView.ViewHolder{
        TextView name;
        CardView parentlayout;

        public courseholder(@NonNull View itemView) {
            super(itemView);
            name=itemView.findViewById(R.id.name);
            parentlayout=itemView.findViewById(R.id.courseItem);

        }
    }

}
