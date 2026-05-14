package com.example.ValaBankBackend.service;

import com.example.ValaBankBackend.entity.Account;
import com.example.ValaBankBackend.entity.Balance;
import com.example.ValaBankBackend.entity.Transaction;
import com.example.ValaBankBackend.enums.Currency;
import com.example.ValaBankBackend.repository.AccountRepository;
import com.example.ValaBankBackend.repository.BalanceRepository;
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
    private final BalanceRepository balanceRepository;
    private final CurrencyService currencyService;


    @Transactional
    public void makeTransaction(Account sender, Account receiver, BigDecimal amount,String title,Currency currency){
        Balance senderBalance = findBalance(sender,currency);
        Balance receiverBalance = findOrCreateBalance(receiver,currency);
        if (senderBalance.getAmount().compareTo(amount) < 0){
            throw new RuntimeException("insufficient funds in the account");
        }
        senderBalance.setAmount(senderBalance.getAmount().subtract(amount));
        receiverBalance.setAmount(receiverBalance.getAmount().add(amount));

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
    public void exchangeCurrency(Long accountId, Currency from,Currency to,BigDecimal amountToSell){
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found")    );
        Balance sourceBalance = findBalance(account,from);
        Balance targetBalance = findOrCreateBalance(account,to);
        if (sourceBalance.getAmount().compareTo(amountToSell) < 0 ){
            throw new RuntimeException("Insufficient funds in " +from);
        }
        BigDecimal amountToBuy = currencyService.convert(amountToSell,from,to);
        sourceBalance.setAmount(sourceBalance.getAmount().subtract(amountToSell));
        targetBalance.setAmount(targetBalance.getAmount().add(amountToBuy));
        balanceRepository.save(sourceBalance);
        balanceRepository.save(targetBalance);
    }
    private Balance findOrCreateBalance(Account account,Currency currency){
        return account.getBalances().stream()
                .filter(b -> b.getCurrency() == currency)
                .findFirst()
                .orElseGet(() -> {
                    Balance newBalance = new Balance();
                    newBalance.setAccount(account);
                    newBalance.setCurrency(currency);
                    newBalance.setAmount(BigDecimal.ZERO);
                    account.getBalances().add(newBalance);
                    return newBalance;
                });
    }
    @Transactional
    public void deposit(Account receiver,BigDecimal amount,Currency currency){
        validateAmount(amount);
        Balance receiverBalance = findOrCreateBalance(receiver,currency);

        receiverBalance.setAmount(receiverBalance.getAmount().add(amount));
        Transaction transaction = new Transaction();
        transaction.setReceiver(receiver);
        transaction.setAmount(amount);
        transaction.setTransactionDate(LocalDateTime.now());
        accountRepository.save(receiver);
        transactionRepository.save(transaction);
        System.out.println("Deposit done!");
    }
    @Transactional
    public void withdraw(Account payingAccount,BigDecimal amount,Currency currency){

        validateAmount(amount);
        Balance payingBalance = findBalance(payingAccount,currency);
        if (payingBalance.getAmount().compareTo(amount)< 0){
            throw new RuntimeException("insufficient funds in the account");
        }
        payingBalance.setAmount(payingBalance.getAmount().subtract(amount));
        Transaction transaction = new Transaction();
        transaction.setSender(payingAccount);
        transaction.setAmount(amount);
        transaction.setTransactionDate(LocalDateTime.now());
        accountRepository.save(payingAccount);
        transactionRepository.save(transaction);
        System.out.println("Withdraw done!");
    }
    private void validateAmount(BigDecimal amount){
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0){
            throw new IllegalArgumentException("Amount must be greater than zero");
        }
    }
    private Balance findBalance(Account account,Currency currency){
        return account.getBalances().stream()
                .filter(b -> b.getCurrency() == currency)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("you don't have wallet in this currency"));
    }
}

