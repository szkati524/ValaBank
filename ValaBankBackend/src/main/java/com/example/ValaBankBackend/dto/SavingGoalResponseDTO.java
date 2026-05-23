package com.example.ValaBankBackend.dto;

public record SavingGoalResponseDTO(Long id,String name,java.math.BigDecimal targetAmount,java.math.BigDecimal currentAmount,Long accountId) {
}
