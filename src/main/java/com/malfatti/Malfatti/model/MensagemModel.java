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
@Table(name = "mensagens")
@Getter
@Setter
@NoArgsConstructor
public class MensagemModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_remetente")
    private UsuarioModel remetente;

    @ManyToOne
    @JoinColumn(name = "id_destinatario")
    private UsuarioModel destinatario;

    @Column(nullable = false)
    private java.time.LocalDateTime envio;
    @PrePersist
    private void prePersist() {
        this.envio = java.time.LocalDateTime.now();
    }

    @Column(length = 7000)
    private String conteudo;

    @Enumerated(EnumType.STRING)
    private Status status;
}

enum Status {
    ENVIADO, ENTREGUE, LIDO
}