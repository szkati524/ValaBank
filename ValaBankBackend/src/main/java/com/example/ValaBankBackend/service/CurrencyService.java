package com.example.ValaBankBackend.service;

import com.example.ValaBankBackend.dto.NbpRateDTO;
import com.example.ValaBankBackend.dto.NbpTableDTO;
import com.example.ValaBankBackend.enums.Currency;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;


@Service
@Slf4j
public class CurrencyService {

    private final EnumMap<Currency, BigDecimal> rates = new EnumMap<>(Currency.class);
    private final RestTemplate restTemplate = new RestTemplate();

public CurrencyService(){
    rates.put(Currency.PLN,BigDecimal.ONE);
    rates.put(Currency.EUR,new BigDecimal("4.00"));
    rates.put(Currency.USD,new BigDecimal("4.50"));
    rates.put(Currency.GBP,new BigDecimal("5.00"));


}
@Scheduled(fixedRate = 360000)
public void fetchRateFromNbp(){
    String url = "http://api.nbp.pl/api/exchangerates/tables/A?format=json";
    try{
        NbpTableDTO[] response = restTemplate.getForObject(url,NbpTableDTO[].class);
        if (response != null && response.length > 0){
            List<NbpRateDTO> nbpRates = response[0].rates();
            for (NbpRateDTO nbpRate : nbpRates){
                try{
                    Currency currency = Currency.valueOf(nbpRate.code());
                    updateRate(currency,nbpRate.mid());
                } catch (IllegalArgumentException e){

                }
            }
            log.info("Currency rates have been updated successfully from NBP");
        }
    }
catch (Exception e){
    log.error("Failed to retrieve rates from NBP: {}",e.getMessage());
}
}
public void updateRate(Currency currency,BigDecimal newRate){
    rates.put(currency, newRate);
    log.debug("Updated rate for{}: {}",currency,newRate);
}
public BigDecimal getRate(Currency currency){
    return rates.getOrDefault(currency,BigDecimal.ONE);
}
public Map<Currency,BigDecimal > getRates(){
    return Collections.unmodifiableMap(rates);
}
public BigDecimal convert(BigDecimal amount, Currency from,Currency to){
    if (from == to) return amount;
    BigDecimal fromRate = getRate(from);
    BigDecimal toRate = getRate(to);
    return amount.multiply(fromRate)
            .divide(toRate, 2, java.math.RoundingMode.HALF_UP);
}
}
