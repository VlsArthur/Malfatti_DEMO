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

import com.malfatti.Malfatti.model.TrabalhoModel;
import com.malfatti.Malfatti.service.TrabalhoService;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/trabalhos")
public class TrabalhoController {
    @Autowired
    private TrabalhoService trabalhoService;

    @GetMapping
    public List<TrabalhoModel> listarTodos() throws IOException {
        return trabalhoService.listarTodos();
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<TrabalhoModel> buscarPorUsuario(@PathVariable Long usuarioId) throws IOException {
        return trabalhoService.buscarPorUsuarioId(usuarioId);
    }

    @GetMapping("/usuario/{usuarioId}/count")
    public Long contarPorUsuario(@PathVariable Long usuarioId) {
        return trabalhoService.contarPorUsuarioId(usuarioId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) throws IOException {
        if (trabalhoService.procurarPorID(id).isPresent()) {
            trabalhoService.deletar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
public TrabalhoModel salvar(@RequestBody TrabalhoModel trabalhoModel) throws IOException {
    String base64 = trabalhoModel.getArquivo();

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

    trabalhoModel.setArquivo(path.toString());
    return trabalhoService.salvar(trabalhoModel);
}


    @PutMapping("/{id}")
    public ResponseEntity<TrabalhoModel> editar(@PathVariable Long id, @RequestBody TrabalhoModel trabalhoModel) throws IOException {
        if (trabalhoService.procurarPorID(id).isPresent()) {
            TrabalhoModel trabalhoExistente = trabalhoService.procurarPorID(id).get();
            if (trabalhoModel.getArquivo() != null) trabalhoExistente.setArquivo(trabalhoModel.getArquivo());
            if (trabalhoModel.getNome() != null) trabalhoExistente.setNome(trabalhoModel.getNome());
            if (trabalhoModel.getDescricao() != null) trabalhoExistente.setDescricao(trabalhoModel.getDescricao());
            return ResponseEntity.ok(this.salvar(trabalhoExistente));
        }

        return ResponseEntity.notFound().build();
    }
}
