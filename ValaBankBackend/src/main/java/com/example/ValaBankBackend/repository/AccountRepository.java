package com.example.ValaBankBackend.repository;

import com.example.ValaBankBackend.entity.Account;
import com.example.ValaBankBackend.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account,Long> {

    Optional<Account> findByAccountNumber(long accountNumber);
    List<Account> findByClientId(Long clientId);

    List<Account> findByClient(Client client);

}
