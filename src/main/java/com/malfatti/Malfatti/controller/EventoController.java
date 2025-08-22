package com.malfatti.Malfatti.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

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

import com.malfatti.Malfatti.model.EventoModel;
import com.malfatti.Malfatti.service.EventoService;

@RestController
@CrossOrigin("*")
@RequestMapping("api/eventos")
public class EventoController {
    @Autowired
    private EventoService eventoService;

    @GetMapping
    public List<EventoModel> listarTodos() throws IOException {
        return eventoService.listarTodos();
    }

    @PostMapping
    public EventoModel salvar(@RequestBody EventoModel eventoModel) throws IOException {
        String base64 = eventoModel.getImagem();

    if (base64 == null || !base64.contains(",")) {
        throw new IllegalArgumentException("Formato de imagem inválido.");
    }

    String[] partes = base64.split(",");
    String metadata = partes[0];
    String conteudoBase64 = partes[1].replaceAll("\\s+", ""); // Remove espaços e quebras

    // Tenta extrair extensão
    String extensao;
    try {
        extensao = metadata.split(";")[0].split("/")[1];
    } catch (Exception e) {
        throw new IllegalArgumentException("Extensão de imagem inválida.");
    }

    byte[] bytesArquivo;
    try {
        bytesArquivo = Base64.getDecoder().decode(conteudoBase64);
    } catch (IllegalArgumentException e) {
        throw new IllegalArgumentException("Imagem em Base64 inválida.");
    }

    String nomeArquivo = UUID.randomUUID() + "." + extensao;
    Path path = Path.of("uploads", nomeArquivo);
    Files.createDirectories(path.getParent());
    Files.write(path, bytesArquivo);

    eventoModel.setImagem(path.toString());
    return eventoService.salvar(eventoModel);
    }

    @PutMapping("{id}")
    public ResponseEntity<EventoModel> atualizar(@PathVariable Long id, @RequestBody EventoModel eventoModel) throws IOException {
        if (eventoService.BuscarPorID(id).isPresent()) {
            EventoModel eventoExistente = eventoService.BuscarPorID(id).get();
            if (eventoModel.getResponsavel() != null) eventoExistente.setResponsavel(eventoModel.getResponsavel());
            if (eventoModel.getNome() != null) eventoExistente.setNome(eventoModel.getNome());
            if (eventoModel.getDescricao() != null) eventoExistente.setDescricao(eventoModel.getDescricao());
            if (eventoModel.getRealizacao() != null) eventoExistente.setRealizacao(eventoModel.getRealizacao());
            if (eventoModel.getCep() != null) eventoExistente.setCep(eventoModel.getCep());
            if (eventoModel.getLogradouro() != null) eventoExistente.setLogradouro(eventoModel.getLogradouro());
            if (eventoModel.getNumero() != null) eventoExistente.setNumero(eventoModel.getNumero());
            if (eventoModel.getComplemento() != null) eventoExistente.setComplemento(eventoModel.getComplemento());
            if (eventoModel.getBairro() != null) eventoExistente.setBairro(eventoModel.getBairro());
            if (eventoModel.getCidade() != null) eventoExistente.setCidade(eventoModel.getCidade());
            if (eventoModel.getEstado() != null) eventoExistente.setEstado(eventoModel.getEstado());
            if (eventoModel.getImagem() != null) eventoExistente.setImagem(eventoModel.getImagem());

            return ResponseEntity.ok(eventoService.salvar(eventoExistente));
        }          
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) throws IOException {
        if (eventoService.BuscarPorID(id).isPresent()) {
            eventoService.deletar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
 