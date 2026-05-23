package com.example.ValaBankBackend.dto;

import com.example.ValaBankBackend.enums.Currency;

import java.math.BigDecimal;

public record DepositRequestDTO(Long accountId, BigDecimal amount, int DurationInMonths, BigDecimal interestRate,
                                Currency currency) {
}
