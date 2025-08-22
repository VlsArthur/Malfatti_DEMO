package com.malfatti.Malfatti.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.malfatti.Malfatti.model.VinculoModel;
import com.malfatti.Malfatti.repository.VinculoRepository;

@Service
public class VinculoService {
    @Autowired
    private VinculoRepository vinculoRepository;

    public List<VinculoModel> listarTodos() {
        return vinculoRepository.findAll();
    }

    public Optional<VinculoModel> procurarPorID(Long id) {
        return vinculoRepository.findById(id);
    }

    public VinculoModel salvar(VinculoModel vinculoModel) {
        return vinculoRepository.save(vinculoModel);
    }

    public void deletar(Long id) {
        vinculoRepository.deleteById(id);
    }
}