package com.malfatti.Malfatti.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/uploads")
public class ImageController {

    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            // Construir o caminho do arquivo
            Path imagePath = Paths.get("uploads", filename);
            System.out.println("Tentando servir imagem: " + imagePath.toAbsolutePath()); // Debug
            
            if (!Files.exists(imagePath)) {
                System.err.println("Arquivo não encontrado: " + imagePath.toAbsolutePath());
                return ResponseEntity.notFound().build();
            }
            
            // Ler o arquivo
            byte[] imageBytes = Files.readAllBytes(imagePath);
            
            // Determinar o tipo de conteúdo
            String contentType = Files.probeContentType(imagePath);
            if (contentType == null) {
                contentType = "image/png"; // Default
            }
            
            // Configurar headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setContentLength(imageBytes.length);
            
            System.out.println("Imagem servida com sucesso: " + filename); // Debug
            
            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
            
        } catch (IOException e) {
            System.err.println("Erro ao servir imagem " + filename + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
