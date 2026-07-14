package com.example.ValaBankBackend.service;

import com.example.ValaBankBackend.dto.AccountResponseDTO;
import com.example.ValaBankBackend.dto.CreateAccountDTO;
import com.example.ValaBankBackend.dto.UpdateLimitsDTO;
import com.example.ValaBankBackend.entity.Account;
import com.example.ValaBankBackend.entity.Balance;
import com.example.ValaBankBackend.entity.Client;
import com.example.ValaBankBackend.enums.Currency;
import com.example.ValaBankBackend.repository.AccountRepository;
import com.example.ValaBankBackend.repository.ClientRepository;
import jakarta.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final ClientRepository clientRepository;

    public AccountResponseDTO addAccount(CreateAccountDTO dto){
        Account account = mapToEntity(dto);
        Client client = clientRepository.findById(dto.clientId())
                .orElseThrow(() -> new EntityNotFoundException("Cannot find client with id: " + dto.clientId()));
        account.setClient(client);
        account.setBlocked(false);
        Balance plnBalance = new Balance();
        plnBalance.setCurrency(Currency.PLN);
        plnBalance.setAmount(BigDecimal.ZERO);
        plnBalance.setAccount(account);
      account.getBalances().add(plnBalance);

        Account savedAccount = accountRepository.save(account);

        return new AccountResponseDTO(savedAccount);


    }
    public List<Account> findAllAccounts(){
        return accountRepository.findAll();
    }
    public Account findById(Long id){
      return accountRepository.findById(id)
              .orElseThrow(() -> new EntityNotFoundException("not found account with id: " + id));

    }
    public void deleteAccountById(Long id) {
        if (accountRepository.existsById(id)) {
            accountRepository.deleteById(id);
        } else {
            throw new RuntimeException("cannot find account with id: " + id);
        }
    }
        @Transactional
        public Account updateLimits(Long accountId, UpdateLimitsDTO dto) {
            Account account = accountRepository.findById(accountId)
                    .orElseThrow(() -> new EntityNotFoundException("Account not found"));
            if (dto.dailyLimit() != null) {
                account.setDailyLimit(dto.dailyLimit());

            }
            if (dto.monthlyLimit() != null) {
                account.setMonthlyLimit(dto.monthlyLimit());
            }
            return accountRepository.save(account);
        }
    public Account mapToEntity(CreateAccountDTO dto){
        Account account = new Account();
        account.setAccountNumber(dto.accountNumber());
        account.setBalances(new ArrayList<>());

        return account;
    }
    @Transactional
    public void toggleAccountLock(Long id){
        Account account = findById(id);
        account.setBlocked(!account.isBlocked());
        accountRepository.save(account);
    }
    @Transactional(readOnly = true)
    public AccountResponseDTO searchByAccountNumber(long accountNumber){
        return  accountRepository.findByAccountNumber(accountNumber)
                .map(AccountResponseDTO::new)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with number: " + accountNumber));
    }
    @Transactional(readOnly = true)
    public List<AccountResponseDTO> findAccountsByClientId(Long clientId){
        return accountRepository.findByClientId(clientId).stream()
                .map(AccountResponseDTO::new)
                .toList();
    }
}
