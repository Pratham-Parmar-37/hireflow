package com.hireflow.interviewservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI interviewServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Interview Service API")
                        .description("Manages interview scheduling information for HireFlow AI")
                        .version("1.0.0"));
    }
}
