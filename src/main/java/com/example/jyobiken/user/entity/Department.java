package com.example.jyobiken.user.entity;

import java.util.Optional;

public enum Department {
    INFORMATION_SYSTEMS("情報システム科", 2),
    GENERAL_SYSTEMS_ENGINEERING("総合システム工学科", 3),
    ADVANCED_INFORMATION_ENGINEERING("高度情報工学科", 4);

    private final String displayName;
    private final int durationYears;

    Department(String displayName, int durationYears) {
        this.displayName = displayName;
        this.durationYears = durationYears;
    }

    public String getDisplayName(){
        return displayName;
    }

    public int getDurationYears(){
        return durationYears;
    }

    public static Optional<Department> getByDisplayName(String displayName){
        if(displayName == null){
            return Optional.empty();
        }

        // 空白を取り除く
        String normalizedName = displayName.trim();

        // 学科名を一つずつ確かめる
        for(Department department : values()){
            if(department.getDisplayName().equals(normalizedName)){
                return Optional.of(department);
            }
        }

        return Optional.empty();
    }
}
