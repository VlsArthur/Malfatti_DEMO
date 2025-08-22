package com.malfatti.Malfatti.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.malfatti.Malfatti.model.EventoModel;

@Repository
public interface EventoRepository extends JpaRepository<EventoModel, Long> {
    
}
