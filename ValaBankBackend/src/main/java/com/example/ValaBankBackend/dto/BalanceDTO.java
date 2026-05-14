package com.example.ValaBankBackend.dto;

import com.example.ValaBankBackend.entity.Balance;
import com.example.ValaBankBackend.enums.Currency;

import java.math.BigDecimal;

public record BalanceDTO(Long id,BigDecimal amount, Currency currency) {
    public BalanceDTO(Balance balance){
        this(balance.getId(),balance.getAmount(),balance.getCurrency());
    }
}
