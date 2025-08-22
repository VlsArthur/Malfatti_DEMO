package com.malfatti.Malfatti.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "trabalhos")
@Getter
@Setter
@NoArgsConstructor
public class TrabalhoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_artista")
    private UsuarioModel usuarioModel;

    @Column
    private String arquivo;

    @Enumerated(EnumType.STRING)
    private Categoria categoria;

    @Column(nullable = false)
    private String nome;

    @Column(length = 1000)
    private String descricao;
}

enum Categoria {
    MUSICA, DANCA, TEATRO, ARTE_VISUAL, LITERATURA, CINEMA, OUTROS
}