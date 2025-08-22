package com.malfatti.Malfatti.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.malfatti.Malfatti.model.UsuarioModel;
import com.malfatti.Malfatti.repository.UsuarioRepository;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<UsuarioModel> listarTodos() throws IOException {
        List<UsuarioModel> usuarios = usuarioRepository.findAll();
        for (int i = 0; i < usuarios.size(); i++) {
            usuarios.set(i, converterPathPraBase64(usuarios.get(i)));
        }
        return usuarios;
    }

    public Optional<UsuarioModel> buscarPorId(Long id) throws IOException {
        System.out.println("Buscando usuário por ID: " + id); // Debug

        Optional<UsuarioModel> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isEmpty()) {
            System.err.println("Usuário não encontrado com ID: " + id);
            return Optional.empty();
        }

        UsuarioModel usuarioModel = usuarioOpt.get();
        System.out.println("Usuário encontrado: " + usuarioModel.getNome()); // Debug

        usuarioModel = converterPathPraBase64(usuarioModel);
        return Optional.of(usuarioModel);
    }

    public Optional<UsuarioModel> buscarPorEmail(String email) throws IOException {
        UsuarioModel usuarioModel = usuarioRepository.findByEmail(email).get();
        usuarioModel = converterPathPraBase64(usuarioModel);
        return Optional.of(usuarioModel);
    }

    public UsuarioModel salvar(UsuarioModel usuarioModel) {
        return usuarioRepository.save(usuarioModel);
    }

    public void deletar(Long id) {
        usuarioRepository.deleteById(id);
    }

    private UsuarioModel converterPathPraBase64(UsuarioModel usuarioModel) throws IOException {
        if (usuarioModel.getFotoPerfil() == null || usuarioModel.getFotoPerfil().trim().isEmpty()) {
            return usuarioModel;
        }

        // Se já é base64, não converter
        if (usuarioModel.getFotoPerfil().startsWith("data:")) {
            return usuarioModel;
        }

        try {
            Path path = Path.of(usuarioModel.getFotoPerfil());
            System.out.println("Tentando ler arquivo: " + path.toAbsolutePath()); // Debug

            if (!Files.exists(path)) {
                System.err.println("Arquivo não encontrado: " + path.toAbsolutePath());
                usuarioModel.setFotoPerfil(null); // Remove referência inválida
                return usuarioModel;
            }

            byte[] imageBytes = Files.readAllBytes(path);
            String mimeType = Files.probeContentType(path);
            if (mimeType == null) {
                mimeType = "image/png"; // Default
            }
            String base64 = "data:" + mimeType + ";base64," + Base64.getEncoder().encodeToString(imageBytes);
            usuarioModel.setFotoPerfil(base64);
            System.out.println("Conversão para base64 realizada com sucesso"); // Debug
        } catch (Exception e) {
            System.err.println("Erro ao converter imagem para base64: " + e.getMessage());
            usuarioModel.setFotoPerfil(null); // Remove referência inválida em caso de erro
        }

        return usuarioModel;
    }
}