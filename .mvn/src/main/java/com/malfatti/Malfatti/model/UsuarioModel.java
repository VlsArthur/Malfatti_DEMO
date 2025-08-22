package com.malfatti.Malfatti.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
public class UsuarioModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String usuario;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(length = 8)
    private String CEP;

    @Column
    private String logradouro;

    @Column
    private String numero;

    @Column
    private String complemento;

    @Column
    private String bairro;

    @Column
    private String cidade;

    @Column
    private String estado;

    @Column
    private String telefone1;

    @Column
    private String telefone2;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoUsuario tipoUsuario;

    @Enumerated(EnumType.STRING)
    private AreaArtistica areaPrincipal;

    @Enumerated(EnumType.STRING)
    private AreaArtistica areaSecundaria;

    @Column(length = 480)
    private String biografia;

    @Column(length = 1000)
    private String experiencia;
}

enum TipoUsuario {
    COMUM, ARTISTA
}

enum AreaArtistica {
    MUSICA, DANCA, TEATRO, ARTE_VISUAL, LITERATURA, CINEMA, OUTROS
}