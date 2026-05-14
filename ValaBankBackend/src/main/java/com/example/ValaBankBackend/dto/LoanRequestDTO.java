package com.example.ValaBankBackend.dto;

import java.math.BigDecimal;

public record LoanRequestDTO(Long accountId, BigDecimal amount,int months,BigDecimal interestRate) {
}
