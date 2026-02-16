package com.patientvocate.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

/**
 * Service for extracting text content from PDF files using Apache PDFBox.
 */
@Service
public class PDFParserService {

    private static final Logger log = LoggerFactory.getLogger(PDFParserService.class);

    /**
     * Extract text from a PDF file.
     *
     * @param file the uploaded PDF file
     * @return extracted text content
     */
    public String extractText(MultipartFile file) {
        log.info("Extracting text from PDF: {}, size: {} bytes", file.getOriginalFilename(), file.getSize());

        try (PDDocument document = Loader.loadPDF(file.getBytes())) {

            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            if (text == null || text.trim().isEmpty()) {
                log.warn("PDF text extraction returned empty result for: {}", file.getOriginalFilename());
                throw new RuntimeException("Could not extract text from PDF. The file may be scanned/image-based. " +
                        "Try uploading an image (JPG/PNG) instead for OCR processing.");
            }

            log.info("Successfully extracted {} characters from PDF", text.length());
            return text.trim();

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to extract text from PDF: {}", file.getOriginalFilename(), e);
            throw new RuntimeException("Failed to read PDF file: " + e.getMessage(), e);
        }
    }

    /**
     * Check if a file is a PDF based on content type and extension.
     */
    public boolean isPDF(MultipartFile file) {
        String contentType = file.getContentType();
        String filename = file.getOriginalFilename();

        return (contentType != null && contentType.equals("application/pdf")) ||
               (filename != null && filename.toLowerCase().endsWith(".pdf"));
    }
}
