package com.example.ValaBankBackend.dto;

import java.math.BigDecimal;

public record NbpRateDTO(String currency, String code, BigDecimal mid) {
}
