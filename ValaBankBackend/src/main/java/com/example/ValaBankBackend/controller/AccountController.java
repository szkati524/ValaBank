package com.example.ValaBankBackend.controller;

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
    public ResponseEntity<List<Account>> getAllAccounts(){
       List<Account> accounts =  accountService.findAllAccounts();
        return ResponseEntity.ok(accounts   );
    }
    @PostMapping
    public ResponseEntity<Account> addAccount(@RequestBody Account account){
        accountService.addAccount(account);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Account> findAccountById(@PathVariable Long id){
        Account account = accountService.findById(id);
        return ResponseEntity.ok(account);
    }
}
