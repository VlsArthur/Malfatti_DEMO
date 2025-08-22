package com.malfatti.Malfatti.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.malfatti.Malfatti.model.MensagemModel;
import com.malfatti.Malfatti.repository.MensagemRepository;

@Service
public class MensagemService {
    @Autowired
    private MensagemRepository mensagemRepository;

    public List<MensagemModel> listarTodos() {
        return mensagemRepository.findAll();
    }

    public Optional<MensagemModel> procurarPorID(Long id) {
        return mensagemRepository.findById(id);
    }

    public MensagemModel salvar(MensagemModel mensagemModel) {
        return mensagemRepository.save(mensagemModel);
    }

    public void deletar(Long id) {
        mensagemRepository.deleteById(id);
    }
}