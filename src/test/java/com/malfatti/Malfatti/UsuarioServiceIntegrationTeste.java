package com.malfatti.Malfatti;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.util.List;

import com.malfatti.Malfatti.model.UsuarioModel;
import com.malfatti.Malfatti.service.UsuarioService;

@SpringBootTest
class UsuarioServiceIntegrationTest {

    @Autowired
    private UsuarioService usuarioService;

    /*
     * Teste: Cadastro de Usuário
     * Objetivo: Validar se o sistema está cadastrando usuários corretamente
     */
    @Test
    void testCadastrarEBuscarUsuario() throws IOException {
        System.out.println("[TESTE] Iniciando teste de cadastro e busca de usuário...");
        
        // Cria usuário
        UsuarioModel usuario = new UsuarioModel();
        usuario.setNome("João Silva");
        usuario.setEmail("joao.silva@example.com");
        usuario.setSenha("senha123");

        System.out.println("[TESTE] Tentando salvar o usuário: " + usuario.getNome());

        // Salva usando o service real
        UsuarioModel usuarioSalvo = usuarioService.salvar(usuario);

        // Verificações
        assertNotNull(usuarioSalvo.getId(), "[ASSERT] O ID não deveria ser nulo");
        assertEquals("João Silva", usuarioSalvo.getNome(), "[ASSERT] O nome deveria ser João Silva");

        // Busca do banco
        var usuarioBuscado = usuarioService.buscarPorId(usuarioSalvo.getId());
        System.out.println("[TESTE] Buscando usuário com ID: " + usuarioSalvo.getId());

        assertTrue(usuarioBuscado.isPresent(), "[ASSERT] O usuário buscado deve existir");
        assertEquals("joao.silva@example.com", usuarioBuscado.get().getEmail(), 
            "[ASSERT] O email do usuário buscado deveria ser joao.silva@example.com");

        System.out.println("[TESTE] Teste de cadastro finalizado com sucesso!");
    }

    /*
     * Teste: Listagem de Usuários
     * Objetivo: Validar se o sistema está listando todos os usuários corretamente
     */
    @Test
    void testListarTodosUsuarios() throws IOException {
        System.out.println("[TESTE] Iniciando teste de listagem de usuários...");

        // Cria e salva alguns usuários
        UsuarioModel usuario1 = new UsuarioModel();
        usuario1.setNome("Maria Oliveira");
        usuario1.setEmail("maria.oliveira@example.com");
        usuarioService.salvar(usuario1);

        UsuarioModel usuario2 = new UsuarioModel();
        usuario2.setNome("Carlos Souza");
        usuario2.setEmail("carlos.souza@example.com");
        usuarioService.salvar(usuario2);

        System.out.println("[TESTE] Buscando todos os usuários cadastrados...");

        // Busca todos os usuários
        List<UsuarioModel> usuarios = usuarioService.listarTodos();

        // Verificações
        assertFalse(usuarios.isEmpty(), "[ASSERT] A lista de usuários não deveria estar vazia");
        assertTrue(usuarios.size() >= 2, "[ASSERT] Deveria haver pelo menos 2 usuários na lista");

        System.out.println("[TESTE] Número de usuários encontrados: " + usuarios.size());
        System.out.println("[TESTE] Teste de listagem finalizado com sucesso!");
    }

    /*
     * Teste: Atualização de Usuário
     * Objetivo: Validar se o sistema está atualizando os dados do usuário corretamente
     */
    @Test
    void testAtualizarUsuario() throws IOException {
        System.out.println("[TESTE] Iniciando teste de atualização de usuário...");

        // Cria e salva usuário
        UsuarioModel usuario = new UsuarioModel();
        usuario.setNome("Ana Paula");
        usuario.setEmail("ana.paula@example.com");
        UsuarioModel usuarioSalvo = usuarioService.salvar(usuario);

        System.out.println("[TESTE] Usuário salvo com ID: " + usuarioSalvo.getId());

        // Atualiza dados
        usuarioSalvo.setNome("Ana Paula Costa");
        usuarioSalvo.setEmail("ana.costa@example.com");
        UsuarioModel usuarioAtualizado = usuarioService.salvar(usuarioSalvo);

        // Busca do banco para verificar
        var usuarioBuscado = usuarioService.buscarPorId(usuarioAtualizado.getId());

        // Verificações
        assertTrue(usuarioBuscado.isPresent(), "[ASSERT] O usuário deveria existir");
        assertEquals("Ana Paula Costa", usuarioBuscado.get().getNome(), 
            "[ASSERT] O nome deveria ter sido atualizado");
        assertEquals("ana.costa@example.com", usuarioBuscado.get().getEmail(), 
            "[ASSERT] O email deveria ter sido atualizado");

        System.out.println("[TESTE] Teste de atualização finalizado com sucesso!");
    }

    /*
     * Teste: Exclusão de Usuário
     * Objetivo: Validar se o sistema está excluindo usuários corretamente
     */
    @Test
    void testExcluirUsuario() throws IOException {
        System.out.println("[TESTE] Iniciando teste de exclusão de usuário...");

        // Cria e salva usuário
        UsuarioModel usuario = new UsuarioModel();
        usuario.setNome("Temporário");
        usuario.setEmail("temp@example.com");
        UsuarioModel usuarioSalvo = usuarioService.salvar(usuario);

        System.out.println("[TESTE] Usuário criado com ID: " + usuarioSalvo.getId());

        // Exclui o usuário
        usuarioService.deletar(usuarioSalvo.getId());
        System.out.println("[TESTE] Usuário excluído");

        // Tenta buscar o usuário excluído
        var usuarioBuscado = usuarioService.buscarPorId(usuarioSalvo.getId());

        // Verificações
        assertFalse(usuarioBuscado.isPresent(), "[ASSERT] O usuário não deveria mais existir");

        System.out.println("[TESTE] Teste de exclusão finalizado com sucesso!");
    }
}