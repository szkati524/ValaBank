package com.example.ValaBankBackend.repository;

import com.example.ValaBankBackend.entity.SavingGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SavingGoalRepository extends JpaRepository<SavingGoal,Long> {
}
