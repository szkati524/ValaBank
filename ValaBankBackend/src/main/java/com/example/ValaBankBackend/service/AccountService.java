package com.example.ValaBankBackend.service;

import com.example.ValaBankBackend.dto.AccountResponseDTO;
import com.example.ValaBankBackend.dto.CreateAccountDTO;
import com.example.ValaBankBackend.entity.Account;
import com.example.ValaBankBackend.entity.Client;
import com.example.ValaBankBackend.repository.AccountRepository;
import com.example.ValaBankBackend.repository.ClientRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
    public void deleteAccountById(Long id){
        if (accountRepository.existsById(id)){
            accountRepository.deleteById(id);
        }else {
            throw new RuntimeException("cannot find account with id: " + id);
        }
    }
    public Account mapToEntity(CreateAccountDTO dto){
        Account account = new Account();
        account.setAccountNumber(dto.accountNumber());
        account.setBalance(dto.balance());
        return account;
    }
}
