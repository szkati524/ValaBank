package com.example.ValaBankBackend.dto;

import com.example.ValaBankBackend.enums.Currency;

import java.math.BigDecimal;

public record ExchangeResponseDTO(Long clientId,Currency from, Currency to, BigDecimal amount) {
}
