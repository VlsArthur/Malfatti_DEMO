package com.malfatti.Malfatti.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.malfatti.Malfatti.model.MensagemModel;

@Repository
public interface MensagemRepository extends JpaRepository<MensagemModel, Long> {
    
}
