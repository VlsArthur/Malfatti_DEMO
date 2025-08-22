package com.malfatti.Malfatti.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.malfatti.Malfatti.model.TrabalhoModel;
import com.malfatti.Malfatti.repository.TrabalhoRepository;

@Service
public class TrabalhoService {
    @Autowired
    private TrabalhoRepository trabalhoRepository;

    public TrabalhoModel salvar(TrabalhoModel trabalhoModel) {
        return trabalhoRepository.save(trabalhoModel);
    }

    public List<TrabalhoModel> listarTodos() throws IOException {
        List<TrabalhoModel> trabalhos = trabalhoRepository.findAll();
        for (int i = 0; i < trabalhos.size(); i++) {
            trabalhos.set(i, converterPathPraBase64(trabalhos.get(i)));
        }
        return trabalhos;
    }

    public Optional<TrabalhoModel> procurarPorID(Long id) throws IOException {
        TrabalhoModel trabalhoModel = trabalhoRepository.findById(id).get();
        trabalhoModel = converterPathPraBase64(trabalhoModel);
        return Optional.of(trabalhoModel);
    }

    public void deletar(Long id) {
        trabalhoRepository.deleteById(id);
    }

    public List<TrabalhoModel> buscarPorUsuarioId(Long usuarioId) throws IOException {
        List<TrabalhoModel> trabalhos = trabalhoRepository.findByUsuarioId(usuarioId);
        for (int i = 0; i < trabalhos.size(); i++) {
            trabalhos.set(i, converterPathPraBase64(trabalhos.get(i)));
        }
        return trabalhos;
    }

    public Long contarPorUsuarioId(Long usuarioId) {
        return trabalhoRepository.countByUsuarioId(usuarioId);
    }

    private TrabalhoModel converterPathPraBase64(TrabalhoModel trabalhoModel) throws IOException {
        Path path = Path.of(trabalhoModel.getArquivo());
        byte[] imageBytes = Files.readAllBytes(path);
        String mimeType = Files.probeContentType(path);
        String base64 = "data:" + mimeType + ";base64," + Base64.getEncoder().encodeToString(imageBytes);
        trabalhoModel.setArquivo(base64);
        return trabalhoModel;
    }
}
