import os
import tempfile
import cv2
import numpy as np
import pytesseract
import fitz  # PyMuPDF
from PIL import Image

def preprocess_image(image_path: str) -> str:
    """Apply OpenCV preprocessing to improve OCR accuracy."""
    img = cv2.imread(image_path)
    if img is None:
        return image_path
        
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply adaptive thresholding
    thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )
    
    # Save the preprocessed image to a temp file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.png')
    cv2.imwrite(temp_file.name, thresh)
    return temp_file.name

def process_pdf(pdf_path: str) -> str:
    """Extract text from PDF using PyMuPDF. Falls back to OCR if no text found."""
    text = ""
    doc = fitz.open(pdf_path)
    
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        page_text = page.get_text()
        
        if page_text.strip():
            text += page_text + "\n"
        else:
            # If no text (scanned PDF), render page to image and OCR
            pix = page.get_pixmap()
            img_data = pix.tobytes("png")
            
            temp_img = tempfile.NamedTemporaryFile(delete=False, suffix='.png')
            temp_img.write(img_data)
            temp_img.close()
            
            preprocessed_path = preprocess_image(temp_img.name)
            img = Image.open(preprocessed_path)
            
            # Using Tesseract OCR
            # Note: Tesseract must be installed on the system
            try:
                ocr_text = pytesseract.image_to_string(img, lang='eng+hin') # common for Indian land records
                text += ocr_text + "\n"
            except Exception as e:
                print(f"OCR Error: {e}. Is Tesseract installed?")
            
            # Cleanup temp files
            os.remove(temp_img.name)
            if preprocessed_path != temp_img.name:
                os.remove(preprocessed_path)
                
    doc.close()
    return text

def process_image(image_path: str) -> str:
    """Process a single image file."""
    preprocessed_path = preprocess_image(image_path)
    img = Image.open(preprocessed_path)
    
    try:
        text = pytesseract.image_to_string(img, lang='eng+hin')
    except Exception as e:
        print(f"OCR Error: {e}. Is Tesseract installed?")
        text = ""
        
    if preprocessed_path != image_path:
        os.remove(preprocessed_path)
        
    return text

def extract_raw_text(local_path: str) -> str:
    """Main entry point for OCR service."""
    if not os.path.exists(local_path):
        raise Exception(f"File not found: {local_path}")
        
    _, ext = os.path.splitext(local_path)
    ext = ext.lower()
    
    if ext == '.pdf':
        text = process_pdf(local_path)
    elif ext in ['.jpg', '.jpeg', '.png']:
        text = process_image(local_path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")
        
    return text
