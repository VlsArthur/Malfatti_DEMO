package com.malfatti.Malfatti.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
    public List<UsuarioModel> listarTodos() {
        return usuarioService.listarTodos();
    }

    @PostMapping
    public UsuarioModel salvar(UsuarioModel usuarioModel) {
        return usuarioService.salvar(usuarioModel);
    }

    @PutMapping("{id}")
    public ResponseEntity<UsuarioModel> editar(@PathVariable Long id, UsuarioModel usuarioModel) {
        if (usuarioService.buscarPorId(id).isPresent()) {
            UsuarioModel usuarioExistente = usuarioService.buscarPorId(id).get();
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

            return ResponseEntity.ok(usuarioService.salvar(usuarioExistente));
        }
        return ResponseEntity.notFound().build();
    }
}
