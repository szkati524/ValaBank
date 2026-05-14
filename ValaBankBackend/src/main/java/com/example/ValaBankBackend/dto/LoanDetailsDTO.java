package com.example.ValaBankBackend.dto;

import com.example.ValaBankBackend.entity.Loan;

import java.math.BigDecimal;
import java.time.LocalDate;

public record LoanDetailsDTO(Long loanId, String clientName, String accountNumber, BigDecimal totalToRepay, BigDecimal remainingAmount, BigDecimal paidAmount, BigDecimal monthlyInstallment,
                             LocalDate startDate) {
    public LoanDetailsDTO(Loan loan){
        this(
                loan.getId(),
                loan.getAccount().getClient().getName() + " " + loan.getAccount().getClient().getSurname(),
                String.valueOf(loan.getAccount().getAccountNumber()),
                loan.getTotalAmountToRepay(),
                loan.getRemainingAmount(),
                loan.getTotalAmountToRepay().subtract(loan.getRemainingAmount()),
                loan.getMonthlyInstallment(),
                loan.getStartDate()
        );
    }
}
