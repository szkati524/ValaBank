package com.example.ValaBankBackend.entity;



import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String surname;
    private String email;
    private boolean isActive = true;
    @Column(name = "birth_date",nullable = false,updatable = false)
    private LocalDate birthDate;
    @OneToMany(mappedBy = "client")
    private List<Account> accounts = new ArrayList<>();
}
