package com.example.ValaBankBackend.entity;

import com.example.ValaBankBackend.enums.Currency;
import com.example.ValaBankBackend.enums.TransactionType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class TransactionHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long senderAccountId;
    private Long receiverAccountId;
    private BigDecimal amount;
    private Currency currency;
    private String title;
    private LocalDateTime timestamp;
    @Enumerated(EnumType.STRING)
    private TransactionType type;

}
