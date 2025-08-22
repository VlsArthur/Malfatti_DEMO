package com.malfatti.Malfatti.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.malfatti.Malfatti.model.VinculoModel;
import com.malfatti.Malfatti.service.VinculoService;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/vinculos")
public class VinculoController {
    @Autowired
    private VinculoService vinculoService;

    @GetMapping
    public List<VinculoModel> listarTodos() {
        return vinculoService.listarTodos();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (vinculoService.procurarPorID(id).isPresent()) {
            vinculoService.deletar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public VinculoModel salvar(@RequestBody VinculoModel vinculoModel) {
        return vinculoService.salvar(vinculoModel);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VinculoModel> editar(@PathVariable Long id, @RequestBody VinculoModel vinculoModel) {
        if (vinculoService.procurarPorID(id).isPresent()) {
            VinculoModel vinculoExistente = vinculoService.procurarPorID(id).get();
            if (vinculoModel.getStatusVinculo() != null) vinculoExistente.setStatusVinculo(vinculoModel.getStatusVinculo());
            return ResponseEntity.ok(vinculoService.salvar(vinculoExistente));
        }

        return ResponseEntity.notFound().build();
    }
}
