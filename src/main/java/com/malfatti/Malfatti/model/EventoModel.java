package com.malfatti.Malfatti.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "eventos")
@Getter
@Setter
@NoArgsConstructor
public class EventoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String imagem;
    
    @Column
    private String nome;

    @Column
    private String descricao;
    
    @Column
    private String responsavel;

    @Column
    private java.time.LocalDateTime realizacao;

    @Column
    private String cep;
    
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
}
