package com.example.ValaBankBackend.repository;

import com.example.ValaBankBackend.dto.FinancialReportDTO;
import com.example.ValaBankBackend.entity.Account;
import com.example.ValaBankBackend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction,Long> {

    List<Transaction> findBySenderId(Long senderId);

    @Query("SELECT new com.example.ValaBankBackend.dto.FinancialReportDTO(" +
            "CASE WHEN t.sender.id = :accountId THEN 'OUTGOING' ELSE 'INCOMING' END, " +
            "SUM(t.amount)) " +
            "FROM Transaction t " +
            "WHERE (t.sender.id = :accountId OR t.receiver.id = :accountId) " +
            "AND t.transactionDate >= :startDate " +
            "GROUP BY CASE WHEN t.sender.id = :accountId THEN 'OUTGOING' ELSE 'INCOMING' END")
    List<FinancialReportDTO> getMonthlyFinancialReport(
            @Param("accountId") Long accountId,
            @Param("startDate") LocalDateTime startDate
    );
    List<Transaction> findBySenderIdOrReceiverIdOrderByTransactionDateDesc(Long senderId,Long receiverId);
}

