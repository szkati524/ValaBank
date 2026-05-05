package com.example.ValaBankBackend.dto;

import com.example.ValaBankBackend.entity.Account;
import com.example.ValaBankBackend.entity.Client;

import java.util.List;

public record ClientResponseDTO(Long id, String name, String surname, String email, boolean isActive, List<Long> accountIds, List<Long> accountNumbers) {

    public ClientResponseDTO(Client client){
        this(client.getId(),
                client.getName(),
                client.getSurname(),
                client.getEmail(),
                client.isActive(),
                client.getAccounts().stream()
                        .map(Account::getId)
                        .toList(),
                client.getAccounts().stream()
                        .map(Account::getAccountNumber)
                        .toList()
        );
    }
}
