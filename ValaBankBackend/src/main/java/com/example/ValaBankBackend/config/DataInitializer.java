package com.example.ValaBankBackend.config;

import com.example.ValaBankBackend.entity.Account;
import com.example.ValaBankBackend.entity.Balance;
import com.example.ValaBankBackend.entity.Client;
import com.example.ValaBankBackend.entity.User;
import com.example.ValaBankBackend.enums.Currency;
import com.example.ValaBankBackend.enums.Role;
import com.example.ValaBankBackend.repository.AccountRepository;
import com.example.ValaBankBackend.repository.ClientRepository;
import com.example.ValaBankBackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AccountRepository accountRepository;
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (accountRepository.count() == 0) {
            System.out.println("Initializing database H2 with clients and accounts...");


            Client client1 = new Client();
            client1.setName("Jan");
            client1.setSurname("Kowalski");
            client1.setEmail("test@op.pl");
            client1.setBirthDate(LocalDate.parse("2005-05-05"));
            client1.setActive(true);
            Client savedClient1 = clientRepository.save(client1);

            Account account1 = new Account();
            account1.setAccountNumber(12345);
            account1.setClient(savedClient1);
            account1.setBalances(new ArrayList<>());

            Balance balance1 = new Balance();
            balance1.setCurrency(Currency.PLN);
            balance1.setAmount(new BigDecimal("10000.00"));
            balance1.setAccount(account1);

            account1.getBalances().add(balance1);
            accountRepository.save(account1);

            User user1 = new User();
            user1.setUsername("VLB111111");
            user1.setPassword(passwordEncoder.encode("jan123"));
            user1.setEmail(savedClient1.getEmail());
            user1.setRole(Role.CLIENT);
            user1.setFirstLogin(false);
            user1.setClient(savedClient1);
            userRepository.save(user1);



            User user2 = new User();
            user2.setUsername("VLB222222");
            user2.setPassword(passwordEncoder.encode("anna123"));
            user2.setEmail("anna@op.pl");
            user2.setRole(Role.CLIENT);
            user2.setFirstLogin(false);


            Client client2 = new Client();
            client2.setName("Anna");
            client2.setSurname("Nowak");
            client2.setEmail("anna@op.pl");
            client2.setBirthDate(LocalDate.parse("2005-01-01"));
            client2.setActive(true);


            client2.setUser(user2);
            user2.setClient(client2);


            Client savedClient2 = clientRepository.save(client2);


            Account account2 = new Account();
            account2.setAccountNumber(67890);
            account2.setClient(savedClient2);
            account2.setBalances(new ArrayList<>());

            Balance balance2 = new Balance();
            balance2.setCurrency(Currency.PLN);
            balance2.setAmount(new BigDecimal("500.00"));
            balance2.setAccount(account2);

            account2.getBalances().add(balance2);
            accountRepository.save(account2);


            Client client3 = new Client();
            client3.setName("Piotr");
            client3.setSurname("Wiśniewski");
            client3.setEmail("piotr.wisniewski@op.pl");
            client3.setBirthDate(LocalDate.parse("1998-11-12"));
            client3.setActive(true);
            Client savedClient3 = clientRepository.save(client3);

            Account account3 = new Account();
            account3.setAccountNumber(99999);
            account3.setClient(savedClient3);
            account3.setBalances(new ArrayList<>());

            Balance balance3 = new Balance();
            balance3.setCurrency(Currency.PLN);
            balance3.setAmount(new BigDecimal("100.00"));
            balance3.setAccount(account3);

            account3.getBalances().add(balance3);
            accountRepository.save(account3);

            User user3 = new User();
            user3.setUsername("VLB9999999");
            user3.setPassword("");
            user3.setEmail(savedClient3.getEmail());
            user3.setRole(Role.CLIENT);
            user3.setFirstLogin(true);
            user3.setClient(savedClient3);
            userRepository.save(user3);

            System.out.println("=========================================================");
            System.out.println("Database initialized successfully!");
            System.out.println("Jan Kowalski created with REAL ID: " + savedClient1.getId());
            System.out.println("Anna Nowak created with REAL ID: " + savedClient2.getId());
            System.out.println("=========================================================");
        }
    }
}