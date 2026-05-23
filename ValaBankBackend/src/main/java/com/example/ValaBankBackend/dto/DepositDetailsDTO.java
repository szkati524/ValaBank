package com.example.ValaBankBackend.dto;

import com.example.ValaBankBackend.entity.SavingDeposit;
import com.example.ValaBankBackend.enums.Currency;
import com.example.ValaBankBackend.enums.DepositStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DepositDetailsDTO(Long depositId, Long accountId, BigDecimal principal, BigDecimal interestRate, Currency currency,
                                LocalDate startDate, LocalDate endDate, DepositStatus status) {
    public DepositDetailsDTO(SavingDeposit d){
        this(d.getId(),d.getAccount().getId(),d.getPrincipal(),d.getInterestRate(),d.getCurrency(),d.getStartDate(),d.getEndDate(),d.getStatus());
    }

}
