package com.example.ValaBankBackend.controller;

import com.example.ValaBankBackend.entity.Transaction;
import com.example.ValaBankBackend.repository.TransactionRepository;
import com.example.ValaBankBackend.service.PdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/pdf")
@RequiredArgsConstructor
public class PdfController {
    private final PdfService pdfService;
    private final TransactionRepository transactionRepository;

    @GetMapping("/download/{senderId}")
    public ResponseEntity<byte[]> downloadStatement(@PathVariable Long senderId){
        List<Transaction> history = transactionRepository.findBySenderId(senderId);
        byte[] pdfBytes = pdfService.generateTransactionHistoryPdf(history,"ACCOUNT-ID-"+senderId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment","balance_" + senderId + ".pdf");
        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
