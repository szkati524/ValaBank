package com.example.ValaBankBackend.service;

import com.example.ValaBankBackend.entity.Transaction;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfService {
    public byte[] generateTransactionHistoryPdf(List<Transaction> transactions,String accountNumber){
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        try {
            PdfWriter.getInstance(document,out);
            document.open();
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD,18);
            Paragraph title = new Paragraph("VALA BANK - BALANCE",titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);
            Font infoFont = FontFactory.getFont(FontFactory.HELVETICA,12);
            Paragraph info = new Paragraph("Transaction History from accountNumber: " + accountNumber,infoFont);
            info.setSpacingAfter(20);
            document.add(info);
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{3f,4f,2f,2f});
            Font headFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD,12);
            PdfPCell h1 = new PdfPCell(new Phrase("Data",headFont));
            PdfPCell h2 = new PdfPCell(new Phrase("Title",headFont));
            PdfPCell h3 = new PdfPCell(new Phrase("Amount",headFont));
            PdfPCell h4 = new PdfPCell(new Phrase("Currency",headFont));
            table.addCell(h1);
            table.addCell(h2);
            table.addCell(h3);
            table.addCell(h4);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            for(Transaction tx :transactions){
                table.addCell(tx.getTransactionDate().format(formatter));
                table.addCell(tx.getTitle());
                table.addCell(tx.getAmount().toString());
                table.addCell("PLN");
            }
            document.add(table);
            document.close();
        } catch (DocumentException e){
            throw new RuntimeException("Error while generation pdf file",e);
        }
        return out.toByteArray();
    }
}
