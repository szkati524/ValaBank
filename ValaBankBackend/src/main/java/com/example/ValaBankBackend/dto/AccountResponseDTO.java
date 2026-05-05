package com.example.ValaBankBackend.dto;

import com.example.ValaBankBackend.entity.Account;

import java.math.BigDecimal;

public record AccountResponseDTO(Long id, long accountNumber, BigDecimal balance, Long clientId) {

    public AccountResponseDTO(Account account){
        this(
                account.getId(),
        account.getAccountNumber(),
        account.getBalance(),
        account.getClient() != null ? account.getClient().getId() : null
                );
    }
}
