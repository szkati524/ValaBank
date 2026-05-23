package com.example.ValaBankBackend.service;

import com.example.ValaBankBackend.dto.CreateSavingGoalDTO;
import com.example.ValaBankBackend.entity.Account;
import com.example.ValaBankBackend.entity.SavingGoal;
import com.example.ValaBankBackend.repository.AccountRepository;
import com.example.ValaBankBackend.repository.SavingGoalRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SavingGoalService {
    private final SavingGoalRepository savingGoalRepository;
    private final AccountRepository accountRepository;

    @Transactional
    public SavingGoal createGoal(Long accountId, CreateSavingGoalDTO dto){
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found") );
        SavingGoal goal = new SavingGoal();
        goal.setName(dto.name());
        goal.setTargetAmount(dto.targetAmount());
        goal.setAccount(account);
        return savingGoalRepository.save(goal);
    }

    @Transactional
    public void activateSmartSaver(Long accountId,Long goalId){
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found") );
        SavingGoal goal = savingGoalRepository.findById(goalId)
                .orElseThrow(() -> new EntityNotFoundException("Saving goal not found") );
        if (!goal.getAccount().getId().equals(accountId)){
            throw new RuntimeException("This saving goal does not belong to this account!");
        }
        account.setSmartSaverEnabled(true);
        account.setActiveSavingGoal(goal);
        accountRepository.save(account);
    }
}
