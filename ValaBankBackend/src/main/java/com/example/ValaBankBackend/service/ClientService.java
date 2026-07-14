package com.example.ValaBankBackend.service;

import com.example.ValaBankBackend.dto.ClientResponseDTO;
import com.example.ValaBankBackend.dto.CreateClientDTO;
import com.example.ValaBankBackend.entity.Client;
import com.example.ValaBankBackend.repository.ClientRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientResponseDTO addClient(CreateClientDTO dto){
        Client clientToSave = mapToEntity(dto);
        clientToSave.setActive(true);
        Client savedClient = clientRepository.save(clientToSave);
        return new ClientResponseDTO(savedClient);
    }
    public List<Client> showAllClients(String searchPhrase){

        if (searchPhrase == null || searchPhrase.isBlank()){
            return clientRepository.findAll();
        }
        return clientRepository.searchByMultipleCriteria(searchPhrase.toLowerCase());
    }
    @Transactional
    public ClientResponseDTO updateClient(Long id,CreateClientDTO dto){
        Client client = findClientById(id);
        client.setName(dto.name());
        client.setSurname(dto.surname());
        client.setEmail(dto.email());
        client.setBirthDate(dto.birthDate());
        return new ClientResponseDTO(clientRepository.save(client));
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
    @Transactional
    public void toggleClientStatus(Long id){
        Client client = findClientById(id);
        client.setActive(!client.isActive());
        clientRepository.save(client);
    }
    public Client mapToEntity(CreateClientDTO createDto){
        Client client = new Client();
        client.setName(createDto.name());
        client.setSurname(createDto.surname());
        client.setEmail(createDto.email());
        client.setBirthDate(createDto.birthDate());
return client;
    }

}
