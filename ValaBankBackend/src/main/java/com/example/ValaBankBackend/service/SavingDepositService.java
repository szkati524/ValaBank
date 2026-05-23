package com.example.ValaBankBackend.service;

import com.example.ValaBankBackend.entity.Account;
import com.example.ValaBankBackend.entity.SavingDeposit;
import com.example.ValaBankBackend.entity.TransactionHistory;
import com.example.ValaBankBackend.enums.Currency;
import com.example.ValaBankBackend.enums.DepositStatus;
import com.example.ValaBankBackend.enums.TransactionType;
import com.example.ValaBankBackend.repository.AccountRepository;
import com.example.ValaBankBackend.repository.SavingDepositRepository;
import com.example.ValaBankBackend.repository.TransactionHistoryRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SavingDepositService {
    private final SavingDepositRepository depositRepository;
    private final AccountRepository accountRepository;
    private final TransactionService transactionService;
    private final TransactionHistoryRepository historyRepository;

    @Transactional
    public SavingDeposit openDeposit(Long accountId, BigDecimal amount, int durationInMonths, BigDecimal interestRate, Currency currency) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));
        transactionService.withdraw(account, amount, currency);

        SavingDeposit deposit = new SavingDeposit();
        deposit.setAccount(account);
        deposit.setPrincipal(amount);
        deposit.setInterestRate(interestRate);
        deposit.setCurrency(currency);
        deposit.setStartDate(LocalDate.now());
        deposit.setEndDate(LocalDate.now().plusMonths(durationInMonths));
        deposit.setStatus(DepositStatus.ACTIVE);
        SavingDeposit savedDeposit = depositRepository.save(deposit);
saveToHistory(account.getId(),null,amount,currency,"Opening saving deposit ID: " + savedDeposit.getId(),TransactionType.DEPOSIT);
return savedDeposit;
    }
    @Transactional
    public void terminateEarly(Long depositId){
        SavingDeposit deposit = depositRepository.findById(depositId)
                .orElseThrow(() -> new EntityNotFoundException("Deposit not found") );
        if (deposit.getStatus() != DepositStatus.ACTIVE){
            throw new IllegalArgumentException("Deposit is not active");
        }
        transactionService.deposit(deposit.getAccount(),deposit.getPrincipal(),deposit.getCurrency());
        deposit.setStatus(DepositStatus.TERMINATED);
        depositRepository.save(deposit);
        saveToHistory(null,deposit.getAccount().getId(),deposit.getPrincipal(),deposit.getCurrency(),
                "Early termination of deposit ID: " + deposit.getId() + " No interest earned ",TransactionType.DEPOSIT);
        log.info("Deposit terminated early by customer. Principal refunded.",deposit.getId());
    }
    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void processMatureDeposit(){
        LocalDate today = LocalDate.now();
        List<SavingDeposit> matureDeposits = depositRepository.findAllByStatusAndEndDateLessThanEqual(DepositStatus.ACTIVE,today);
        log.info("Starting automatic mature deposits processing for deposits",matureDeposits.size());
        for (SavingDeposit deposit : matureDeposits){
            try{
                BigDecimal interest = deposit.getPrincipal().multiply(deposit.getInterestRate());
                BigDecimal totalPayout = deposit.getPrincipal().add(interest);
                transactionService.deposit(deposit.getAccount(),totalPayout,deposit.getCurrency());
                deposit.setStatus(DepositStatus.COMPLETED);
                depositRepository.save(deposit);
                saveToHistory(null,deposit.getAccount().getId(),totalPayout,deposit.getCurrency(),
                        "Payout completed deposit ID: " + deposit.getId() + " wtih interest: " + interest,TransactionType.DEPOSIT);
                log.info("Successfully processed mature Deposit ID: Payout: ",deposit.getId(),totalPayout );

            } catch (Exception e){
                log.error("Failed to process mature deposits ID: Reason: ",deposit.getId(),e.getMessage());
            }
        }
    }


    private void saveToHistory(Long senderId, Long receiverId, BigDecimal amount, Currency currency, String title, TransactionType
            type){
        TransactionHistory history = new TransactionHistory();
        history.setSenderAccountId(senderId);
        history.setReceiverAccountId(receiverId);
        history.setAmount(amount);
        history.setCurrency(currency);
        history.setTitle(title);
        history.setTimestamp(LocalDateTime.now());
        history.setType(type);
       historyRepository.save(history);

    }
}
