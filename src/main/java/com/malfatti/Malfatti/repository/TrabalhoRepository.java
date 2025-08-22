package com.malfatti.Malfatti.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.malfatti.Malfatti.model.TrabalhoModel;

@Repository
public interface TrabalhoRepository extends JpaRepository<TrabalhoModel, Long> {

    // Buscar trabalhos por ID do usuário
    @Query("SELECT t FROM TrabalhoModel t WHERE t.usuarioModel.id = :usuarioId")
    List<TrabalhoModel> findByUsuarioId(@Param("usuarioId") Long usuarioId);

    // Contar trabalhos por ID do usuário
    @Query("SELECT COUNT(t) FROM TrabalhoModel t WHERE t.usuarioModel.id = :usuarioId")
    Long countByUsuarioId(@Param("usuarioId") Long usuarioId);
}
