package com.example.ValaBankBackend.controller;

import com.example.ValaBankBackend.dto.BalanceOperationDTO;
import com.example.ValaBankBackend.dto.TransactionRequestDTO;
import com.example.ValaBankBackend.entity.Account;
import com.example.ValaBankBackend.entity.Transaction;
import com.example.ValaBankBackend.repository.AccountRepository;
import com.example.ValaBankBackend.service.AccountService;
import com.example.ValaBankBackend.service.TransactionService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Optional;

@RestController
@RequestMapping("/api/transaction")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<String> makeTransaction(@RequestBody TransactionRequestDTO request){
        Account sender = accountService.findById(request.senderId().getId());
        Account receiver = accountService.findById(request.receiverId().getId());
         transactionService.makeTransaction(sender,receiver,request.amount(),request.title());


        return ResponseEntity.ok("Transaction Done!");
    }
    @PostMapping("/{id}/deposit")
    public ResponseEntity<String> makeDeposit(@PathVariable Long id,@RequestBody BalanceOperationDTO dto){
        Account receiver = accountService.findById(id);
        transactionService.deposit(receiver,dto.amount());
        return ResponseEntity.ok("Deposit Done!");
    }
    @PostMapping("/{id}/withdraw")
    public ResponseEntity<String> makeWithdraw(@PathVariable Long id,@RequestBody BalanceOperationDTO dto){
        Account sender = accountService.findById(id);
        transactionService.withdraw(sender,dto.amount());
        return ResponseEntity.ok("Withdraw Done!");
    }
}
