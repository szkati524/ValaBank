package com.example.ValaBankBackend.service;

import com.example.ValaBankBackend.entity.Account;
import com.example.ValaBankBackend.entity.Loan;
import com.example.ValaBankBackend.entity.TransactionHistory;
import com.example.ValaBankBackend.enums.Currency;
import com.example.ValaBankBackend.enums.TransactionType;
import com.example.ValaBankBackend.repository.AccountRepository;
import com.example.ValaBankBackend.repository.LoanRepository;
import com.example.ValaBankBackend.repository.TransactionHistoryRepository;
import com.example.ValaBankBackend.repository.TransactionRepository;
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
public class LoanService {
    private final LoanRepository loanRepository;
    private final AccountRepository accountRepository;
    private final TransactionService transactionService;
    private final TransactionHistoryRepository transactionHistoryRepository;

    @Transactional
    public Loan takeLoan(Long accountId, BigDecimal principal, int months, BigDecimal interestRate) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));
        boolean hasPLN = account.getBalances().stream()
                .anyMatch(b -> b.getCurrency() == Currency.PLN);
        if (!hasPLN) {
            throw new RuntimeException("Loan available only for customers with a PLN account!");
        }
        BigDecimal interest = principal.multiply(interestRate);
        BigDecimal totalToReplay = principal.add(interest);

        BigDecimal monthlyRate = totalToReplay.divide(BigDecimal.valueOf(months), 2, java.math.RoundingMode.HALF_UP);
        Loan loan = new Loan();
        loan.setAccount(account);
        loan.setTotalAmountToRepay(totalToReplay);
        loan.setRemainingAmount(totalToReplay);
        loan.setMonthlyInstallment(monthlyRate);
        loan.setInterestRate(interestRate);
        loan.setDurationInMonths(months);
        loan.setStartDate(LocalDate.now());
        transactionService.deposit(account, principal, Currency.PLN);
        saveToHistory(null, account.getId(), principal, Currency.PLN, "granting a loan to: " + loan.getId(), TransactionType.LOAN_DISBURSEMENT);
        return loanRepository.save(loan);


    }


@Transactional
    public void overpay(Long loanId,BigDecimal amount){
    Loan loan = loanRepository.findById(loanId)
            .orElseThrow(() -> new EntityNotFoundException("Loan not found"));
    transactionService.withdraw(loan.getAccount(),amount,Currency.PLN);
    loan.setRemainingAmount(loan.getRemainingAmount().subtract(amount));
    if (loan.getRemainingAmount().compareTo(BigDecimal.ZERO) < 0){
        loan.setRemainingAmount(BigDecimal.ZERO);
    }
    loanRepository.save(loan);
}
@Scheduled(cron = "0 0 1 * * ?")
    @Transactional
    public void processInstallment() {
    List<Loan> activeLoans = loanRepository.findAllByRemainingAmountGreaterThan(BigDecimal.ZERO);
    log.info("Starting automatic installment processing for {} loans", activeLoans.size());
    for (Loan loan : activeLoans) {
        try {
            BigDecimal installment = loan.getMonthlyInstallment();
            if (loan.getRemainingAmount().compareTo(installment) < 0) {
                installment = loan.getRemainingAmount();
            }
            transactionService.withdraw(loan.getAccount(), installment, Currency.PLN);
            loan.setRemainingAmount(loan.getRemainingAmount().subtract(installment));
            loanRepository.save(loan);
            saveToHistory(loan.getAccount().getId(), null, installment, Currency.PLN, "repayment of a loan installment " + loan.getId(), TransactionType.LOAN_INSTALLMENT);

            log.info("Successfully processed installment for loan ID: {}. Remaining: {}",
                    loan.getId(), loan.getRemainingAmount());

        } catch (Exception e) {
            log.error("Failed to connect installment for loan ID: {}, Reason {}", loan.getId(), e.getMessage());
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
            transactionHistoryRepository.save(history);

}
}

