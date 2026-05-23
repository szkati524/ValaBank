package com.example.ValaBankBackend.config;

import com.example.ValaBankBackend.entity.Account;
import com.example.ValaBankBackend.entity.Balance;
import com.example.ValaBankBackend.entity.Client;
import com.example.ValaBankBackend.enums.Currency;
import com.example.ValaBankBackend.repository.AccountRepository;
import com.example.ValaBankBackend.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AccountRepository accountRepository;
    private final ClientRepository clientRepository;

    @Override
    public void run(String... args) throws Exception {
        if (accountRepository.count() == 0) {
            System.out.println(" Initializing database H2 with clients and accounts...");


            Client client1 = new Client();
            client1.setName("Jan");
            client1.setSurname("Kowalski");
            client1.setEmail("test@op.pl");
            client1.setBirthDate(LocalDate.parse("2005-05-05"));
            clientRepository.save(client1);

            Account account1 = new Account();
            account1.setAccountNumber(12345);
            account1.setClient(client1);
            account1.setBalances(new ArrayList<>());

            Balance balance1 = new Balance();
            balance1.setCurrency(Currency.PLN);
            balance1.setAmount(new BigDecimal("10000.00"));
            balance1.setAccount(account1);

            account1.getBalances().add(balance1);
            accountRepository.save(account1);



            Client client2 = new Client();
            client2.setName("Anna");
            client2.setSurname("Nowak");
            client2.setEmail("anna@op.pl");
            client2.setBirthDate(LocalDate.parse("2005-01-01"));
            clientRepository.save(client2);

            Account account2 = new Account();
            account2.setAccountNumber(67890);
            account2.setClient(client2);
            account2.setBalances(new ArrayList<>());

            Balance balance2 = new Balance();
            balance2.setCurrency(Currency.PLN);
            balance2.setAmount(new BigDecimal("500.00"));
            balance2.setAccount(account2);

            account2.getBalances().add(balance2);
            accountRepository.save(account2);

            System.out.println("Database initialized! Jan (ID: 1), Anna (ID: 2). ready for testing.");
        }
    }
}