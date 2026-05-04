package com.example.ValaBankBackend.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private long accountNumber;
    private BigDecimal balance;
    @Column(name="created_at", nullable = false,updatable = false)
    private LocalDateTime localDateTime;
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

}
