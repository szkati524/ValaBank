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
        if (sender.getBalance().compareTo(amount) < 0){
            throw new RuntimeException("insufficient funds in the account");
        }
          BigDecimal newBalanceSender = sender.getBalance().subtract(amount);
          BigDecimal newBalanceReceiver = receiver.getBalance().add(amount);
        sender.setBalance(newBalanceSender);
        receiver.setBalance(newBalanceReceiver);
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
    @Transactional
    public void deposit(Account receiver,BigDecimal amount){
        validateAmount(amount);
        BigDecimal newBalance = receiver.getBalance().add(amount);
        receiver.setBalance(newBalance);
        Transaction transaction = new Transaction();
        transaction.setReceiver(receiver);
        transaction.setAmount(amount);
        transaction.setTransactionDate(LocalDateTime.now());
        transactionRepository.save(transaction);
        System.out.println("Deposit done!");
    }
    @Transactional
    public void withdraw(Account payingAccount,BigDecimal amount){
        validateAmount(amount);
        if (payingAccount.getBalance().compareTo(amount)< 0){
            throw new RuntimeException("insufficient funds in the account");
        }
        BigDecimal newBalance = payingAccount.getBalance().subtract(amount);
        payingAccount.setBalance(newBalance);
        Transaction transaction = new Transaction();
        transaction.setSender(payingAccount);
        transaction.setAmount(amount);
        transaction.setTransactionDate(LocalDateTime.now());
        transactionRepository.save(transaction);
        System.out.println("Withdraw done!");
    }
    private void validateAmount(BigDecimal amount){
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0){
            throw new IllegalArgumentException("Amount must be greater than zero");
        }
    }
}

