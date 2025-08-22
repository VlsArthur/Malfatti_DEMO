package com.malfatti.Malfatti.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Configurar para servir arquivos da pasta uploads (caminho absoluto)
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:./uploads/", "file:uploads/")
                .setCachePeriod(3600);

        // Configurar para servir arquivos estáticos
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(3600);

        System.out.println("Configuração de recursos estáticos aplicada"); // Debug
    }
}
