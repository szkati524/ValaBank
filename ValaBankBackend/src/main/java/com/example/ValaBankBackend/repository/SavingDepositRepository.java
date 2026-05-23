package com.example.ValaBankBackend.repository;

import com.example.ValaBankBackend.entity.SavingDeposit;
import com.example.ValaBankBackend.enums.DepositStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SavingDepositRepository extends JpaRepository<SavingDeposit,Long> {
    List<SavingDeposit> findAllByStatusAndEndDateLessThanEqual(DepositStatus status, LocalDate now);
    List<SavingDeposit> findAllByAccountId(Long accountId);
}
