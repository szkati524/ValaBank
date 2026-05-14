package com.example.ValaBankBackend.repository;

import com.example.ValaBankBackend.entity.Client;
import com.example.ValaBankBackend.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan,Long> {

    List<Loan> findAllByRemainingAmountGreaterThan(BigDecimal amount);

    List<Loan> findAllByAccountId(Long accountId);
}
