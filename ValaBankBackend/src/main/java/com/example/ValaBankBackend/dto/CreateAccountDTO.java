package com.example.ValaBankBackend.dto;

import java.math.BigDecimal;

public record CreateAccountDTO( long accountNumber, BigDecimal balance, Long clientId) {

}
