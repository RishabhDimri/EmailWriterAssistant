package com.email.reply_writer.Services;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.email.reply_writer.Model.EmailRequest;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;

    @Value("${api.key}")
    private String apiKey;

    @Value("${api.url}")
    private String apiUrl;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateReply(EmailRequest emailRequest) {
        String prompt = buildPrompt(emailRequest);

        Map<String, Object> requestBody = Map.of(
            "contents", new Object[]{
                Map.of("parts", new Object[]{
                    Map.of("text", prompt)
                })
            }
        );

        // Fix: Removed .header("Authorization") and appended "?key=" to the URI
        Object responseObj = webClient.post()
            .uri(apiUrl + "?key=" + apiKey)
            .header("Content-Type", "application/json")
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(Object.class)
            .block();

        return responseObj == null ? "" : extractResponseText(responseObj);
    }

    @SuppressWarnings({"deprecation", "UseSpecificCatch"})
    private String extractResponseText(Object responseObj) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.valueToTree(responseObj);
            return rootNode.path("candidates")
                            .get(0)
                            .path("content")
                            .path("parts")
                            .get(0)
                            .path("text")
                            .asText();
            
        } catch (Exception e) {
            return "Error processing response: " + e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("You are an email assistant. Please generate a reply without subject line to the following email or email chain:\n\n");
        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            promptBuilder.append("Tone: ").append(emailRequest.getTone()).append("\n\n");
        }
        promptBuilder.append("Original Email:\n").append(emailRequest.getEmailContent()).append("\n\n");
        return promptBuilder.toString();
    }
}
