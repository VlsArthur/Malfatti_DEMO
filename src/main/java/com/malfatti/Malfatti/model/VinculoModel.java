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
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "vinculos")
@Getter
@Setter
@NoArgsConstructor
public class VinculoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_seguidor")
    private UsuarioModel remetente;

    @ManyToOne
    @JoinColumn(name = "id_seguindo")
    private UsuarioModel destinatario;

    @Column(nullable = false)
    private java.time.LocalDateTime inicio;
    @PrePersist
    private void prePersist() {
        this.inicio = java.time.LocalDateTime.now();
    }

    @Enumerated(EnumType.STRING)
    private StatusVinculo statusVinculo;
}

enum StatusVinculo {
    ATIVO, INATIVO
}