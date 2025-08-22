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

import com.malfatti.Malfatti.model.MensagemModel;
import com.malfatti.Malfatti.service.MensagemService;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/mensagens")
public class MensagemController {
    @Autowired
    private MensagemService mensagemService;

    @GetMapping
    public List<MensagemModel> listarTodos() {
        return mensagemService.listarTodos();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (mensagemService.procurarPorID(id).isPresent()) {
            mensagemService.deletar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public MensagemModel salvar(@RequestBody MensagemModel mensagemModel) {
        return mensagemService.salvar(mensagemModel);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MensagemModel> editar(@PathVariable Long id, @RequestBody MensagemModel mensagemModel) {
        if (mensagemService.procurarPorID(id).isPresent()) {
            MensagemModel mensagemExistente = mensagemService.procurarPorID(id).get();
            
            return ResponseEntity.ok(mensagemService.salvar(mensagemExistente));
        }

        return ResponseEntity.notFound().build();
    }
}
