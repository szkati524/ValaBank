package com.example.ValaBankBackend.service;

import com.example.ValaBankBackend.entity.Client;
import com.example.ValaBankBackend.repository.ClientRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;

    public Client addClient(Client client){
        return clientRepository.save(client);
    }
    public List<Client> showAllClients(){
        return clientRepository.findAll();
    }
    public Client findClientById(Long id){
        return clientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Not found Client with id: " + id));
    }
    public void deleteClientById(Long id){
        if (clientRepository.existsById(id)){
            clientRepository.deleteById(id);
        }else {
            throw new RuntimeException( "cannot find client with id: " + id);
        }
    }

}
