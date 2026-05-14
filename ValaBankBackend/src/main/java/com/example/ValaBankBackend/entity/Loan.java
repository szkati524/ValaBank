package com.example.ValaBankBackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter @Setter
@NoArgsConstructor

public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private BigDecimal totalAmountToRepay;
    private BigDecimal remainingAmount;
    private BigDecimal monthlyInstallment;
    private BigDecimal interestRate;

    @ManyToOne
private Account account;

    private LocalDate startDate;
    private int durationInMonths;
}
