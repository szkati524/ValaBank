package com.example.ValaBankBackend.controller;

import com.example.ValaBankBackend.dto.TransactionHistoryDTO;
import com.example.ValaBankBackend.repository.TransactionHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class TransactionHistoryController {

    private final TransactionHistoryRepository transactionHistoryRepository;

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<TransactionHistoryDTO>> getHistory(@PathVariable Long accountId){
        List<TransactionHistoryDTO> history = transactionHistoryRepository
                .findAllBySenderAccountIdOrReceiverAccountIdOrderByTimestampDesc(accountId,accountId)
                .stream()
                .map(h -> {
                    boolean isSender = h.getSenderAccountId() != null && h.getSenderAccountId().equals(accountId);
                   return new TransactionHistoryDTO(
                            h.getId(),
                            isSender ? h.getReceiverAccountId() : h.getSenderAccountId(),
                            isSender ? "OUTGOING" : "INCOMING",
                            h.getAmount(),
                            h.getCurrency(),
                            h.getTitle(),
                            h.getTimestamp(),
                            h.getType()
                    );
                })
                .toList();
        return ResponseEntity.ok(history);
    }
}
