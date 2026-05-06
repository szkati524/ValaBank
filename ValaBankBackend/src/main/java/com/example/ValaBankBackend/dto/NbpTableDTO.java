package com.example.ValaBankBackend.dto;

import java.util.List;

public record NbpTableDTO(String table, String no, String effectiveDate, List<NbpRateDTO> rates) {
}
