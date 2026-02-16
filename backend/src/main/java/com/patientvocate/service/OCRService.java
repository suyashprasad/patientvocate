package com.patientvocate.service;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import net.sourceforge.tess4j.util.ImageHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;

/**
 * Service for extracting text from images using Tesseract OCR.
 */
@Service
public class OCRService {

    private static final Logger log = LoggerFactory.getLogger(OCRService.class);

    private static final Set<String> SUPPORTED_IMAGE_TYPES = Set.of(
            "image/jpeg", "image/jpg", "image/png", "image/tiff", "image/bmp"
    );

    @Value("${ocr.tessdata-path:}")
    private String tessdataPath;

    @Value("${ocr.language:eng}")
    private String language;

    /**
     * Extract text from an image file using Tesseract OCR.
     *
     * @param file the uploaded image file
     * @return extracted text content
     */
    public String extractText(MultipartFile file) {
        log.info("Starting OCR for image: {}, size: {} bytes", file.getOriginalFilename(), file.getSize());

        try (InputStream inputStream = file.getInputStream()) {
            BufferedImage image = ImageIO.read(inputStream);
            if (image == null) {
                throw new RuntimeException("Could not read image file: " + file.getOriginalFilename());
            }

            // Preprocess image to improve OCR accuracy, especially for low DPI scans
            try {
                // Convert to grayscale
                image = ImageHelper.convertImageToGrayscale(image);
                // Scale up by 2x to improve resolution (simulating higher DPI)
                image = ImageHelper.getScaledInstance(image, image.getWidth() * 2, image.getHeight() * 2);
                log.info("Preprocessed image for OCR (grayscale, 2x scale)");
            } catch (Exception e) {
                log.warn("Image preprocessing skipped due to error: {}", e.getMessage());
            }

            Tesseract tesseract = new Tesseract();
            if (tessdataPath != null && !tessdataPath.isEmpty()) {
                tesseract.setDatapath(tessdataPath);
            } else {
                // Try to auto-detect Tesseract data path on Linux if not set
                String os = System.getProperty("os.name").toLowerCase();
                if (!os.contains("win")) {
                    String[] commonPaths = {
                            "/usr/share/tesseract-ocr/4.00/tessdata",
                            "/usr/share/tesseract-ocr/5/tessdata",
                            "/usr/share/tessdata"
                    };
                    for (String path : commonPaths) {
                        Path tessDataPath = Paths.get(path);
                        if (Files.exists(tessDataPath) && Files.exists(tessDataPath.resolve(language + ".traineddata"))) {
                            log.info("Auto-detected Tesseract data path: {}", path);
                            tesseract.setDatapath(path);
                            break;
                        }
                    }
                }
            }
            tesseract.setLanguage(language);

            String text = tesseract.doOCR(image);

            if (text == null || text.trim().isEmpty()) {
                throw new RuntimeException("OCR could not extract text from the image. " +
                        "This may be due to low resolution (DPI < 300) or blurriness.");
            }

            log.info("OCR successfully extracted {} characters", text.length());
            return text.trim();

        } catch (TesseractException e) {
            log.error("Tesseract OCR failed for: {}", file.getOriginalFilename(), e);
            throw new RuntimeException("OCR processing failed. Please ensure Tesseract is installed " +
                    "and tessdata is available: " + e.getMessage(), e);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to process image for OCR: {}", file.getOriginalFilename(), e);
            throw new RuntimeException("Failed to process image: " + e.getMessage(), e);
        }
    }

    /**
     * Check if a file is a supported image type.
     */
    public boolean isImage(MultipartFile file) {
        String contentType = file.getContentType();
        String filename = file.getOriginalFilename();

        if (contentType != null && SUPPORTED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            return true;
        }
        if (filename != null) {
            String lower = filename.toLowerCase();
            return lower.endsWith(".jpg") || lower.endsWith(".jpeg") ||
                   lower.endsWith(".png") || lower.endsWith(".tiff") || lower.endsWith(".bmp");
        }
        return false;
    }
}
