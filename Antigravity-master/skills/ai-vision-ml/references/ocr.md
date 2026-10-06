# OCR Integration

## Engine Comparison
| Engine | Languages | Speed | Accuracy | License |
|--------|-----------|-------|----------|---------|
| Tesseract | 100+ | Medium | Good (with preprocessing) | Apache 2.0 |
| EasyOCR | 80+ | Medium | Good | Apache 2.0 |
| PaddleOCR | 80+ | Fast | Very good | Apache 2.0 |

## EasyOCR
```python
import easyocr
reader = easyocr.Reader(['en'])
results = reader.readtext('invoice.png')
for bbox, text, confidence in results:
    print(f"{text} ({confidence:.2f})")
```

## Tesseract
```python
import pytesseract
from PIL import Image
text = pytesseract.image_to_string(Image.open('doc.png'))
# For structured output:
data = pytesseract.image_to_data(Image.open('doc.png'), output_type=pytesseract.Output.DICT)
```

## Preprocessing for Better Accuracy
1. Convert to grayscale.
2. Apply adaptive thresholding or Otsu binarization.
3. Deskew rotated images.
4. Remove noise with median or bilateral filter.
5. Upscale low-resolution images (2-3x) before OCR.

## Post-Processing
- Use regex patterns to extract structured fields (dates, amounts, emails).
- Apply spellcheck for common OCR errors (e.g., "l" vs "1", "O" vs "0").
- Validate extracted data against expected formats before returning.
