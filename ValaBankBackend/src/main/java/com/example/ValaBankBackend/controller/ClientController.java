package com.example.ValaBankBackend.controller;

import com.example.ValaBankBackend.dto.ClientResponseDTO;
import com.example.ValaBankBackend.dto.CreateClientDTO;
import com.example.ValaBankBackend.entity.Client;
import com.example.ValaBankBackend.service.ClientService;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<List<ClientResponseDTO>> getAllClients(@RequestParam(required = false) String search){
        List<Client> clients = clientService.showAllClients(search);
        List<ClientResponseDTO> clientResponseDTOS = clients.stream().map(ClientResponseDTO::new).toList();
        return ResponseEntity.ok(clientResponseDTOS);
    }
    @PostMapping
    public ResponseEntity<ClientResponseDTO> addClient(@RequestBody CreateClientDTO dto){
        ClientResponseDTO savedClient = clientService.addClient(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedClient);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ClientResponseDTO> findClientById(@PathVariable Long id){
       Client client =  clientService.findClientById(id);

        return ResponseEntity.ok(new ClientResponseDTO(client));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ClientResponseDTO> updateClient(@PathVariable Long id,@RequestBody CreateClientDTO dto){
        ClientResponseDTO updated = clientService.updateClient(id,dto);
        return ResponseEntity.ok(updated);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id){
        clientService.deleteClientById(id);
        return ResponseEntity.noContent().build();
    }
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<Void> toggleClientStatus(@PathVariable Long id){
        clientService.toggleClientStatus(id);
        return ResponseEntity.ok().build();
    }
}

