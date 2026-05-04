package com.example.ValaBankBackend.service;

import com.example.ValaBankBackend.entity.Account;
import com.example.ValaBankBackend.repository.AccountRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    public Account addAccount(Account account){
        return accountRepository.save(account);
    }
    public List<Account> findAllAccounts(){
        return accountRepository.findAll();
    }
    public Account findById(Long id){
      return accountRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("not found account with id: " + id));

    }
    public void deleteAccountById(Long id){
        if (accountRepository.existsById(id)){
            accountRepository.deleteById(id);
        }else {
            throw new RuntimeException("cannot find account with id: " + id);
        }
    }
}
