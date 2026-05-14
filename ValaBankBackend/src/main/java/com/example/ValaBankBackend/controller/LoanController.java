package com.example.ValaBankBackend.controller;

import com.example.ValaBankBackend.dto.LoanDetailsDTO;
import com.example.ValaBankBackend.dto.LoanRequestDTO;
import com.example.ValaBankBackend.dto.OverpaymentRequestDTO;
import com.example.ValaBankBackend.entity.Loan;
import com.example.ValaBankBackend.repository.LoanRepository;
import com.example.ValaBankBackend.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/loan")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;
    private final LoanRepository loanRepository;

    @PostMapping
    public ResponseEntity<LoanDetailsDTO> takeLoan(@RequestBody LoanRequestDTO dto){
        Loan loan = loanService.takeLoan(dto.accountId(),dto.amount(),dto.months(),dto.interestRate());
        return ResponseEntity.status(HttpStatus.CREATED).body(new LoanDetailsDTO(loan));
    }
    @GetMapping("/{id}")
    public ResponseEntity<LoanDetailsDTO> getLoanDetails(@PathVariable Long id){
        return loanRepository.findById(id)
                .map(LoanDetailsDTO::new)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<LoanDetailsDTO>> getAccountsLoans(@PathVariable Long accountId){
        List<LoanDetailsDTO> loans = loanRepository.findAllByAccountId(accountId)
                .stream()
                .map(LoanDetailsDTO::new)
                .toList();
        return ResponseEntity.ok(loans);
    }
    @PostMapping("/{id}/overpay")
    public ResponseEntity<String> overpayLoan(@PathVariable Long id, @RequestParam OverpaymentRequestDTO dto){
        loanService.overpay(id,dto.amount());
        return ResponseEntity.ok("Overpayment of " + dto.amount() + " PLN successful!");
    }
}
