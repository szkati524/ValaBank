package com.example.ValaBankBackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private long accountNumber;
    @OneToMany(mappedBy = "account",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Balance> balances;
    @Column(name="created_at", nullable = false,updatable = false)
    private LocalDateTime localDateTime = LocalDateTime.now();
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    private java.math.BigDecimal dailyLimit = new BigDecimal("5000.00");
    private java.math.BigDecimal monthlyLimit = new BigDecimal("20000.00");
    private boolean smartSaverEnabled = false;
    @OneToOne
    @JoinColumn(name = "active_saving_goal_id")
    private SavingGoal activeSavingGoal;
    private boolean blocked;

}
