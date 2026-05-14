package com.example.ValaBankBackend.controller;

import com.example.ValaBankBackend.dto.BalanceOperationDTO;
import com.example.ValaBankBackend.dto.ExchangeResponseDTO;
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

    @PostMapping("/transfer")
    public ResponseEntity<String> makeTransaction(@RequestBody TransactionRequestDTO request){
        Account sender = accountService.findById(request.senderId());
        Account receiver = accountService.findById(request.receiverId());
         transactionService.makeTransaction(sender,receiver,request.amount(),request.title(),request.currency());


        return ResponseEntity.ok("Transaction of " + request.amount() + " " + request.currency() + " successful!");
    }
    @PostMapping("/{id}/deposit")
    public ResponseEntity<String> makeDeposit(@PathVariable Long id,@RequestBody BalanceOperationDTO dto){
        Account account = accountService.findById(id);
        transactionService.deposit(account,dto.amount(),dto.currency());
        return ResponseEntity.ok("Deposited " + dto.amount() + " " + dto.currency());
    }
    @PostMapping("/{id}/withdraw")
    public ResponseEntity<String> makeWithdraw(@PathVariable Long id,@RequestBody BalanceOperationDTO dto){
        Account account = accountService.findById(id);
        transactionService.withdraw(account,dto.amount(),dto.currency());
        return ResponseEntity.ok("Withdraw " + dto.amount() + " " + dto.currency());
    }
    @PostMapping("/accounts/{id}/exchange")
    public ResponseEntity<String> exchangeCurrency(@PathVariable Long id, @RequestBody ExchangeResponseDTO dto){
        transactionService.exchangeCurrency(id,dto.from(),dto.to(),dto.amount());
        return ResponseEntity.ok("Exchanged " + dto.amount() + " " + dto.from() + " to " + dto.to());
    }
}
