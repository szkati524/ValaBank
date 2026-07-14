package com.example.ValaBankBackend.controller;

import com.example.ValaBankBackend.dto.AccountResponseDTO;
import com.example.ValaBankBackend.dto.CreateAccountDTO;
import com.example.ValaBankBackend.dto.UpdateLimitsDTO;
import com.example.ValaBankBackend.entity.Account;
import com.example.ValaBankBackend.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    public ResponseEntity<List<AccountResponseDTO>> getAllAccounts(){
       List<Account> accounts =  accountService.findAllAccounts();
       List<AccountResponseDTO> accountsDto = accounts.stream().map(AccountResponseDTO::new).toList();

        return ResponseEntity.ok(accountsDto);
    }
    @PostMapping
    public ResponseEntity<AccountResponseDTO> addAccount(@RequestBody CreateAccountDTO dto){
        AccountResponseDTO savedAccount = accountService.addAccount(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAccount);
    }
    @GetMapping("/{id}")
    public ResponseEntity<AccountResponseDTO> findAccountById(@PathVariable Long id){
        Account account = accountService.findById(id);
        return ResponseEntity.ok(new AccountResponseDTO(account));
    }
    @PatchMapping("/{id}/limits")
    public ResponseEntity<String> updateLimits(@PathVariable Long id, @RequestBody UpdateLimitsDTO dto){
        accountService.updateLimits(id,dto);
        return ResponseEntity.ok("Transaction limits updated successfully!");
    }
    @GetMapping("/search")
    public ResponseEntity<AccountResponseDTO> searchByNumber(@RequestParam long accountNumber){
       AccountResponseDTO response = accountService.searchByAccountNumber(accountNumber);
       return ResponseEntity.ok(response);
    }
    @PatchMapping("/{id}/toggle-lock")
    public ResponseEntity<Void> toggleAccountLock(@PathVariable Long id){
        accountService.toggleAccountLock(id);
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id){
        accountService.deleteAccountById(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<AccountResponseDTO>> getAccountsByClientId(@PathVariable Long clientId){
        List<AccountResponseDTO> accounts = accountService.findAccountsByClientId(clientId);
        return ResponseEntity.ok(accounts);
    }
}
