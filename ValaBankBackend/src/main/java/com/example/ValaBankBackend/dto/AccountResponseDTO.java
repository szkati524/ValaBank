package com.example.ValaBankBackend.dto;

import com.example.ValaBankBackend.entity.Account;
import com.example.ValaBankBackend.entity.Balance;


import java.math.BigDecimal;
import java.util.List;

public record AccountResponseDTO(Long id, long accountNumber, List<Balance> balances, Long clientId) {

    public AccountResponseDTO(Account account){
        this(
                account.getId(),
        account.getAccountNumber(),
        account.getBalances(),
        account.getClient() != null ? account.getClient().getId() : null
                );
    }
}
