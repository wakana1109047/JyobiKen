package com.example.jyobiken.user.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminPageController {

    @GetMapping("/admin-accounts.html")
    public String accountsPage() {
        return "admin-accounts";
    }

    @GetMapping("/admin-account-detail.html")
    public String accountDetailPage() {
        return "admin-account-detail";
    }
}
