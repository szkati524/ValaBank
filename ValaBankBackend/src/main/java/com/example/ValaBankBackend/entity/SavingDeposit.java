package com.example.ValaBankBackend.entity;

import com.example.ValaBankBackend.enums.Currency;
import com.example.ValaBankBackend.enums.DepositStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class SavingDeposit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Account account;

    private BigDecimal principal;
    private BigDecimal interestRate;
    private Currency currency;
    private LocalDate startDate;
    private LocalDate endDate;
    @Enumerated(EnumType.STRING)
    private DepositStatus status;
}
