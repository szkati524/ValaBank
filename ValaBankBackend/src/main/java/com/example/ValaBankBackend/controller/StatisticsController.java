package com.example.ValaBankBackend.controller;

import com.example.ValaBankBackend.dto.FinancialReportDTO;
import com.example.ValaBankBackend.service.StatisticsService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticsController {

private  final StatisticsService statisticsService;

@GetMapping("/account/{accountId}")
    public ResponseEntity<List<FinancialReportDTO>> getMonthlyReport(@PathVariable Long accountId){
    List<FinancialReportDTO> report = statisticsService.generateMonthlyReport(accountId);
    return ResponseEntity.ok(report);
}
}
