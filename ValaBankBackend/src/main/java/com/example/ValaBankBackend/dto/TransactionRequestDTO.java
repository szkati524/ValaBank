package com.example.ValaBankBackend.dto;

import com.example.ValaBankBackend.entity.Account;

import java.math.BigDecimal;

public record TransactionRequestDTO(Account senderId,Account receiverId, BigDecimal amount, String title)  {
}
