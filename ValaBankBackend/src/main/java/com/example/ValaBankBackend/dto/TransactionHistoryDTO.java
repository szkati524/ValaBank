package com.example.ValaBankBackend.dto;

import com.example.ValaBankBackend.enums.Currency;
import com.example.ValaBankBackend.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionHistoryDTO(Long id, Long partnerAccountId, String direction, BigDecimal amount, Currency currency, String title,
                                    LocalDateTime timestamp, TransactionType type) {
}
