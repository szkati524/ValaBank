package com.example.ValaBankBackend.repository;

import com.example.ValaBankBackend.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client,Long> {

    @Query("SELECT DISTINCT c FROM Client c " +
    "LEFT JOIN c.accounts a " +
    "WHERE LOWER(c.name) LIKE %:phrase% " +
    "OR LOWER(c.surname) LIKE %:phrase% " +
    "OR LOWER(c.email) LIKE %:phrase% " +
    "OR CAST(a.accountNumber AS string) LIKE %:phrase%")
    List<Client> searchByMultipleCriteria(@Param("phrase") String phrase);
}
