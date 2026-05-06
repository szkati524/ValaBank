package com.example.ValaBankBackend.dto;

import com.example.ValaBankBackend.entity.Balance;

import java.math.BigDecimal;
import java.util.List;

public record CreateAccountDTO(long accountNumber, List<Balance> balances, Long clientId) {

}
