package com.example.ValaBankBackend.controller;

import com.example.ValaBankBackend.enums.Currency;
import com.example.ValaBankBackend.service.CurrencyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/currencies")
@RequiredArgsConstructor
public class CurrencyController {

    private final CurrencyService currencyService;

    @GetMapping("/rates")
public ResponseEntity<Map<Currency, BigDecimal>> getAllRates(){
        return ResponseEntity.ok(currencyService.getRates());
    }
}
