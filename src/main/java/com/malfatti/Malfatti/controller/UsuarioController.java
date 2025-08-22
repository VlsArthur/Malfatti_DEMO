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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.malfatti.Malfatti.model.UsuarioModel;
import com.malfatti.Malfatti.service.UsuarioService;



@RestController
@CrossOrigin("*")
@RequestMapping("api/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<UsuarioModel> listarTodos() throws IOException {
        return usuarioService.listarTodos();
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<UsuarioModel> buscarPorId(@PathVariable Long id) throws IOException {
        if (usuarioService.buscarPorId(id).isPresent()) {
            return ResponseEntity.ok(usuarioService.buscarPorId(id).get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UsuarioModel> buscarPorEmail(@PathVariable String email) throws IOException {
        if (usuarioService.buscarPorEmail(email).isPresent()) {
            return ResponseEntity.ok(usuarioService.buscarPorEmail(email).get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public UsuarioModel salvar(@RequestBody UsuarioModel usuarioModel) throws IOException {
        String base64 = usuarioModel.getFotoPerfil();

    // Se não há foto de perfil, salvar sem imagem
    if (base64 == null || base64.trim().isEmpty()) {
        UsuarioModel usuarioSalvo = usuarioService.salvar(usuarioModel);
        try {
            return usuarioService.buscarPorId(usuarioSalvo.getId()).get();
        } catch (Exception e) {
            return usuarioSalvo;
        }
    }

    if (!base64.contains(",")) {
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

    usuarioModel.setFotoPerfil(path.toString());
    UsuarioModel usuarioSalvo = usuarioService.salvar(usuarioModel);

    // Converter path de volta para base64 antes de retornar
    try {
        return usuarioService.buscarPorId(usuarioSalvo.getId()).get();
    } catch (Exception e) {
        return usuarioSalvo;
    }
    }

    @PutMapping("{id}")
    public ResponseEntity<UsuarioModel> editar(@PathVariable Long id, UsuarioModel usuarioModel) throws IOException {
        if (usuarioService.buscarPorId(id).isPresent()) {
            UsuarioModel usuarioExistente = usuarioService.buscarPorId(id).get();
            if (usuarioModel.getFotoPerfil() != null) usuarioExistente.setFotoPerfil(usuarioModel.getFotoPerfil());
            if (usuarioModel.getNome()!=null) usuarioExistente.setNome(usuarioModel.getNome());
            if (usuarioModel.getUsuario()!=null) usuarioExistente.setUsuario(usuarioModel.getUsuario());
            if (usuarioModel.getEmail()!=null) usuarioExistente.setEmail(usuarioModel.getEmail());
            if (usuarioModel.getSenha()!=null) usuarioExistente.setSenha(usuarioModel.getSenha());
            if (usuarioModel.getCEP()!=null) usuarioExistente.setCEP(usuarioModel.getCEP());
            if (usuarioModel.getLogradouro()!=null) usuarioExistente.setLogradouro(usuarioModel.getLogradouro());
            if (usuarioModel.getNumero()!=null) usuarioExistente.setNumero(usuarioModel.getNumero());
            if (usuarioModel.getComplemento()!=null) usuarioExistente.setComplemento(usuarioModel.getComplemento());
            if (usuarioModel.getBairro()!=null) usuarioExistente.setBairro(usuarioModel.getBairro());
            if (usuarioModel.getCidade()!=null) usuarioExistente.setCidade(usuarioModel.getCidade());
            if (usuarioModel.getEstado()!=null) usuarioExistente.setEstado(usuarioModel.getEstado());
            if (usuarioModel.getTelefone1()!=null) usuarioExistente.setTelefone1(usuarioModel.getTelefone1());
            if (usuarioModel.getTelefone2()!=null) usuarioExistente.setTelefone2(usuarioModel.getTelefone2());
            if (usuarioModel.getTipoUsuario()!=null) usuarioExistente.setTipoUsuario(usuarioModel.getTipoUsuario());
            if (usuarioModel.getAreaPrincipal()!=null) usuarioExistente.setAreaPrincipal(usuarioModel.getAreaPrincipal());
            if (usuarioModel.getAreaSecundaria()!=null) usuarioExistente.setAreaSecundaria(usuarioModel.getAreaSecundaria());
            if (usuarioModel.getBiografia()!=null) usuarioExistente.setBiografia(usuarioModel.getBiografia());
            if (usuarioModel.getExperiencia()!=null) usuarioExistente.setExperiencia(usuarioModel.getExperiencia());

            return ResponseEntity.ok(this.salvar(usuarioExistente));
        }
        return ResponseEntity.notFound().build();
    }
}
