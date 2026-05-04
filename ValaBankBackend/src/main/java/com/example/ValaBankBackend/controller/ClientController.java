package com.example.ValaBankBackend.controller;

import com.example.ValaBankBackend.entity.Client;
import com.example.ValaBankBackend.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.aspectj.apache.bcel.generic.InstructionConstants;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @GetMapping
    public ResponseEntity<List<Client>> getAllClients(){
        List<Client> clients = clientService.showAllClients();
        return ResponseEntity.ok(clients);
    }
    @PostMapping
    public ResponseEntity<Client> addClient(@RequestBody Client client){
        clientService.addClient(client);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Client> findClientById(@PathVariable Long id){
       Client client =  clientService.findClientById(id);
        return ResponseEntity.ok(client);
    }
}
