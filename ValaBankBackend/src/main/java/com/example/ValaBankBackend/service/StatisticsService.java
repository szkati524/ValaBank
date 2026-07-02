package com.example.ValaBankBackend.service;

import com.example.ValaBankBackend.dto.FinancialReportDTO;
import com.example.ValaBankBackend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final TransactionRepository transactionRepository;

  public List<FinancialReportDTO> generateMonthlyReport(Long accountId){
      LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
      return transactionRepository.getMonthlyFinancialReport(accountId,startOfMonth);
  }
}
