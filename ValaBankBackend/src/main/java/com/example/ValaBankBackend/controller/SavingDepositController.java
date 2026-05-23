package com.example.ValaBankBackend.controller;

import com.example.ValaBankBackend.dto.DepositDetailsDTO;
import com.example.ValaBankBackend.dto.DepositRequestDTO;
import com.example.ValaBankBackend.entity.SavingDeposit;
import com.example.ValaBankBackend.repository.SavingDepositRepository;
import com.example.ValaBankBackend.service.SavingDepositService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/deposits")
@RequiredArgsConstructor
public class SavingDepositController {

    private final SavingDepositService depositService;
    private final SavingDepositRepository depositRepository;

    @PostMapping
    public ResponseEntity<DepositDetailsDTO> openDeposit(@RequestBody DepositRequestDTO dto){
        SavingDeposit deposit = depositService.openDeposit(dto.accountId(),dto.amount(),dto.DurationInMonths(),dto.interestRate(),dto.currency());
        return ResponseEntity.status(HttpStatus.CREATED).body(new DepositDetailsDTO(deposit));

    }
    @PostMapping("/{id}/terminate")
    public ResponseEntity<String> terminateEarly(@PathVariable Long id){
        depositService.terminateEarly(id);
        return ResponseEntity.ok("Deposit terminated early. Funds returned to account without interest ");
    }
    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<DepositDetailsDTO>> getAccountsDeposits(@PathVariable Long accountId){
        List<DepositDetailsDTO> list = depositRepository.findAllByAccountId(accountId)
                .stream()
                .map(DepositDetailsDTO::new)
                .toList();
        return ResponseEntity.ok(list);
    }
}
