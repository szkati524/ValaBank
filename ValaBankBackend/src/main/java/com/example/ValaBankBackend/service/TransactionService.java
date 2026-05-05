package com.example.ValaBankBackend.service;

import com.example.ValaBankBackend.entity.Account;
import com.example.ValaBankBackend.entity.Transaction;
import com.example.ValaBankBackend.repository.AccountRepository;
import com.example.ValaBankBackend.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;


    @Transactional
    public void makeTransaction(Account sender, Account receiver, BigDecimal amount,String title){

        sender.setBalance(sender.getBalance().subtract(amount));
        receiver.setBalance(receiver.getBalance().add(amount));
       Transaction transaction = new Transaction();
       transaction.setSender(sender);
       transaction.setReceiver(receiver);
       transaction.setAmount(amount);
       transaction.setTitle(title);
       transaction.setTransactionDate(LocalDateTime.now());
       accountRepository.save(sender);
       accountRepository.save(receiver);
       transactionRepository.save(transaction);
        System.out.println("Transaction done!");

    }
}
