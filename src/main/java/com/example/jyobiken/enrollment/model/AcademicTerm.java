package com.example.jyobiken.enrollment.model;

import java.time.LocalDate;

public record AcademicTerm(int academicYear, int semester){
    public static AcademicTerm from(LocalDate localdate){

        int month = localdate.getMonthValue();

        // 1月～3月は去年の年度に合わせる
        int academicYear = month >= 4
                ? localdate.getYear()
                : localdate.getYear() -1;

        // 4月～8月を前期、それ以外（9月～3月）を後期として扱う
        int semester = month >= 4 && month <= 8
                ? 1
                : 2;

        return new AcademicTerm(academicYear, semester);
    }
}
