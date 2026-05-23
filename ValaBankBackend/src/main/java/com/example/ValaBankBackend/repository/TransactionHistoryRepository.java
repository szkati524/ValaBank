package com.example.ValaBankBackend.repository;

import com.example.ValaBankBackend.entity.TransactionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionHistoryRepository extends JpaRepository<TransactionHistory,Long> {

    List<TransactionHistory> findAllBySenderAccountIdOrReceiverAccountIdOrderByTimestampDesc(Long senderAccountId,Long receiverAccountId);
    @Query("SELECT COALESCE(SUM(t.amount),0) FROM TransactionHistory t " + "WHERE t.senderAccountId = :accountId AND t.timestamp >= :startDate")
    BigDecimal calculateOutgoingSumSince(@Param("accountId") Long accountId, @Param("startDate")LocalDateTime startDate);
}
