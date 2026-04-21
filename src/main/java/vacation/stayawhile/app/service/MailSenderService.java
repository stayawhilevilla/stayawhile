package vacation.stayawhile.app.service;

import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

@Service
public class MailSenderService {
	
	public void sendEmail(String toEmail, String subject, String body) {
        // URL of your Node.js mailer service

        String url = "http://31.42.188.109:3000/send-email";

        String jsonPayload = String.format(
                "{\"to\":\"%s\", \"subject\":\"%s\", \"html\":\"%s\"}",
                toEmail,
                subject,
                body.replace("\"", "\\\"") // escape quotes in body
        );

        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Create HTTP request
        HttpEntity<String> request = new HttpEntity<>(jsonPayload, headers);

        // Send request using RestTemplate
        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.postForObject(url, request, String.class);

        System.out.println("Response from mailer: " + response);
    }
	

}
