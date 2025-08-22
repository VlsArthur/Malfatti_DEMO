package com.malfatti.Malfatti.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.malfatti.Malfatti.model.EventoModel;
import com.malfatti.Malfatti.repository.EventoRepository;

@Service
public class EventoService {
    @Autowired
    private EventoRepository eventoRepository;

    public List<EventoModel> listarTodos() throws IOException {
        List<EventoModel> eventos = eventoRepository.findAll();
        for (int i = 0; i < eventos.size(); i++) {
            eventos.set(i, converterPathPraBase64(eventos.get(i)));
        }
        return eventos;
    }

    public EventoModel salvar(EventoModel eventoModel) {
        return eventoRepository.save(eventoModel);
    }

    public Optional<EventoModel> BuscarPorID(Long id) throws IOException {
        EventoModel eventoModel = eventoRepository.findById(id).get();
        eventoModel = converterPathPraBase64(eventoModel);
        return Optional.of(eventoModel);
    }

    public void deletar(Long id) {
        eventoRepository.deleteById(id);
    }

    private EventoModel converterPathPraBase64(EventoModel eventoModel) throws IOException {
        if (eventoModel.getImagem() == null) {
            return eventoModel;
        }
        Path path = Path.of(eventoModel.getImagem());
        byte[] imageBytes = Files.readAllBytes(path);
        String mimeType = Files.probeContentType(path);
        String base64 = "data:" + mimeType + ";base64," + Base64.getEncoder().encodeToString(imageBytes);
        eventoModel.setImagem(base64);
        return eventoModel;
    }
}
