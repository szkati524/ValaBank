package com.example.ValaBankBackend.service;

import com.example.ValaBankBackend.listener.BankEvent;
import com.example.ValaBankBackend.entity.*;
import com.example.ValaBankBackend.enums.Currency;
import com.example.ValaBankBackend.enums.TransactionType;
import com.example.ValaBankBackend.exceptions.LimitExceededException;
import com.example.ValaBankBackend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final BalanceRepository balanceRepository;
    private final CurrencyService currencyService;
    private final TransactionHistoryRepository transactionHistoryRepository;
    private final SavingGoalRepository savingGoalRepository;
    private final ApplicationEventPublisher eventPublisher;


    @Transactional
    public void makeTransaction(Account sender, Account receiver, BigDecimal amount,String title,Currency currency){

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        BigDecimal currentDaySpent = transactionHistoryRepository.calculateOutgoingSumSince(sender.getId(),startOfDay);
        BigDecimal potentialDailyTotal = currentDaySpent.add(amount);
        if (sender.getDailyLimit() != null && potentialDailyTotal.compareTo(sender.getDailyLimit()) > 0) {
            throw new LimitExceededException("Daily transaction limit exceeded! Allowed remaining: "
            + sender.getDailyLimit().subtract(currentDaySpent) + " " + currency);
        }
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        BigDecimal currentMonthSpent = transactionHistoryRepository.calculateOutgoingSumSince(sender.getId(),startOfMonth);
        BigDecimal potentialMonthlyTotal = currentMonthSpent.add(amount);
        if (sender.getMonthlyLimit() != null && potentialMonthlyTotal.compareTo(sender.getMonthlyLimit()) > 0 ){
            throw new LimitExceededException("Monthly transaction limit exceeded! Allowed remaining: "
            + sender.getMonthlyLimit().subtract(currentMonthSpent) + " " + currency);
        }
        BigDecimal roundingAmount = BigDecimal.ZERO;
        if (sender.isSmartSaverEnabled() && sender.getActiveSavingGoal() != null && currency == Currency.PLN){
            roundingAmount = calculateRounding(amount);
}
        BigDecimal totalAmountToDebit = amount.add(roundingAmount);
        Balance senderBalance = findBalance(sender,currency);
        Balance receiverBalance = findOrCreateBalance(receiver,currency);
        if (senderBalance.getAmount().compareTo(totalAmountToDebit) < 0){
            throw new RuntimeException("insufficient funds in the account");
        }
        BigDecimal balanceBefore = senderBalance.getAmount();
        senderBalance.setAmount(senderBalance.getAmount().subtract(totalAmountToDebit));
        receiverBalance.setAmount(receiverBalance.getAmount().add(amount));
        if (roundingAmount.compareTo(BigDecimal.ZERO) > 0){
            SavingGoal goal = sender.getActiveSavingGoal();
            goal.setCurrentAmount(goal.getCurrentAmount().add(roundingAmount));
            savingGoalRepository.save(goal);
            saveToHistory(sender.getId(),null,roundingAmount,currency,"Smart Saver auto-save to goal: " + goal.getName(),TransactionType.SAVING_GOAL_DEPOSIT);
        }

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
        BigDecimal warningLimit = new BigDecimal("50.00");
        if (balanceBefore.compareTo(warningLimit) >= 0 && senderBalance.getAmount().compareTo(warningLimit)< 0){
            eventPublisher.publishEvent(new BankEvent(
                    sender.getClient().getId(),
                    "low account balance remaining only: " + senderBalance.getAmount() + " PLN"
            ));
        }
        saveToHistory(sender.getId(),receiver.getId(),amount,currency,title,TransactionType.TRANSFER);

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
        saveToHistory(null,receiver.getId(),amount,currency,"cash deposit",TransactionType.DEPOSIT);
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
        saveToHistory(payingAccount.getId(),null,amount,currency,"cash withdraw",TransactionType.WITHDRAW);
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
    private BigDecimal calculateRounding(BigDecimal amount){
        BigDecimal nextWholeAmount = amount.setScale(0,java.math.RoundingMode.CEILING);
        if (nextWholeAmount.compareTo(amount) == 0){
            return BigDecimal.ZERO;
        }
        return nextWholeAmount.subtract(amount);
    }
    private void saveToHistory(Long senderId, Long receiverId, BigDecimal amount, Currency currency, String title, TransactionType type){
        TransactionHistory history = new TransactionHistory();
        history.setSenderAccountId(senderId);
        history.setReceiverAccountId(receiverId);
        history.setAmount(amount);
        history.setCurrency(currency);
        history.setTitle(title);
        history.setTimestamp(LocalDateTime.now());
        history.setType(type);
        transactionHistoryRepository.save(history);
    }
}

