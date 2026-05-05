package com.example.ValaBankBackend.dto;

import java.time.LocalDate;

public record CreateClientDTO(String name, String surname, String email, LocalDate birthDate) {

}
