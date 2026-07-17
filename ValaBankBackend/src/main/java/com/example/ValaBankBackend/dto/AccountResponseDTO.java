package com.example.ValaBankBackend.dto;

import com.example.ValaBankBackend.entity.Account;
import com.example.ValaBankBackend.entity.Balance;


import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public record AccountResponseDTO(Long id, long accountNumber, List<BalanceDTO> balances, Long clientId,BigDecimal dailyLimit,BigDecimal monthlyLimit) {

    public AccountResponseDTO(Account account){
        this(
                account.getId(),
        account.getAccountNumber(),
        account.getBalances() != null ?
                account.getBalances().stream()
                        .map(BalanceDTO::new)
                        .toList() : new ArrayList<>(),
        account.getClient() != null ? account.getClient().getId() : null,
                account.getDailyLimit(),
                account.getMonthlyLimit()
                );
    }
}
