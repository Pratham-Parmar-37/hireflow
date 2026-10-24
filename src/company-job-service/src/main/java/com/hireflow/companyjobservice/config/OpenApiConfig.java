package com.hireflow.companyjobservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI companyJobServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Company & Job Service API")
                        .description("Manages companies and job postings for HireFlow AI")
                        .version("1.0.0"));
    }
}
