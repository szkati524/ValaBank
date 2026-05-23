package com.example.ValaBankBackend.dto;

import java.math.BigDecimal;

public record UpdateLimitsDTO(BigDecimal dailyLimit,BigDecimal monthlyLimit) {
}
