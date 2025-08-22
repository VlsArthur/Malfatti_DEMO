package com.malfatti.Malfatti.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.malfatti.Malfatti.model.VinculoModel;

@Repository
public interface VinculoRepository extends JpaRepository<VinculoModel, Long> {
    
}
