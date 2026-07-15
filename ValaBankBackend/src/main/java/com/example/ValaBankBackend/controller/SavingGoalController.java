package com.example.ValaBankBackend.controller;

import com.example.ValaBankBackend.dto.CreateSavingGoalDTO;
import com.example.ValaBankBackend.dto.SavingGoalResponseDTO;
import com.example.ValaBankBackend.entity.SavingGoal;
import com.example.ValaBankBackend.service.SavingGoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saving-goals")
@RequiredArgsConstructor
public class SavingGoalController {

    private final SavingGoalService savingGoalService;

    @PostMapping("/account/{accountId}")
    public ResponseEntity<SavingGoalResponseDTO> createGoal(@PathVariable Long accountId, @RequestBody CreateSavingGoalDTO dto){
        SavingGoal created = savingGoalService.createGoal(accountId,dto);
        SavingGoalResponseDTO response = new SavingGoalResponseDTO(
                created.getId(),
                created.getName(),
                created.getTargetAmount(),
                created.getCurrentAmount(),
                created.getAccount().getId()
        );
        return ResponseEntity.ok(response);
    }
    @PostMapping("/account/{accountId}/activate/{goalId}")
    public ResponseEntity<String> activateSmartSaver(@PathVariable Long accountId,@PathVariable Long goalId){
        savingGoalService.activateSmartSaver(accountId,goalId);
        return ResponseEntity.ok("Smart saver has been activated with goal ID: " + goalId);
    }
    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<SavingGoalResponseDTO>> getAccountsGoals(@PathVariable Long accountId){
        List<SavingGoalResponseDTO> list = savingGoalService.getGoalsByAccountId(accountId)
                .stream()
                .map(goal -> new SavingGoalResponseDTO(
                        goal.getId(),
                        goal.getName(),
                        goal.getTargetAmount(),
                        goal.getCurrentAmount(),
                        goal.getAccount().getId()
                ))
                .toList();
        return ResponseEntity.ok(list);
    }
}
