package com.patientvocate.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import org.springframework.boot.web.client.RestTemplateBuilder;

@Configuration
public class AIConfig {

    @Value("${ai.ollama.base-url}")
    private String ollamaBaseUrl;

    @Value("${ai.ollama.timeout}")
    private int timeoutSeconds;

    @Bean
    public RestTemplate ollamaRestTemplate(RestTemplateBuilder builder) {
        return builder
                .rootUri(ollamaBaseUrl)
                .setConnectTimeout(Duration.ofSeconds(10))
                .setReadTimeout(Duration.ofSeconds(timeoutSeconds))
                .build();
    }
}
