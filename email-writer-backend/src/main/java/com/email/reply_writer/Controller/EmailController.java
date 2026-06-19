package com.email.reply_writer.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.email.reply_writer.Model.EmailRequest;
import com.email.reply_writer.Services.EmailGeneratorService;

import lombok.AllArgsConstructor;

@CrossOrigin(origins="*")
@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class EmailController {

    private final EmailGeneratorService service;
    
    @GetMapping("/hello")
    public String hello() {
        return "Hello, World!";
    }

    @PostMapping("generate")
    public ResponseEntity<String> generateReply(@RequestBody EmailRequest emailRequest) {
        String reponse= service.generateReply(emailRequest);
        return ResponseEntity.ok(reponse);
    }

}
