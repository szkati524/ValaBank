package com.example.ValaBankBackend.dto;

import com.example.ValaBankBackend.entity.Account;
import com.example.ValaBankBackend.enums.Currency;

import java.math.BigDecimal;

public record TransactionRequestDTO(Long senderId, Long receiverId, BigDecimal amount, String title, Currency currency)  {
}
