# Troubleshooting Guide

Solutions for common issues with OCR conversion.

## Quick Diagnostics

### Run Health Check

```bash
# 1. Check system dependencies
libreoffice --version
pdftoppm -v
python3 --version

# 2. Check Python packages
python3 -c "import mistralai; import PIL; import pdf2image; print('OK')"

# 3. Check API key
echo $MISTRAL_API_KEY

# 4. Test conversion tool
npm run ocr:convert -- --help
```

## Common Issues

### 1. LibreOffice Not Found

**Error:**
```
Error in image-conversion:
libreoffice: command not found
```

**Cause:** LibreOffice not installed or not in PATH

**Solutions:**

```bash
# Ubuntu/Debian/WSL
sudo apt-get update
sudo apt-get install libreoffice

# macOS
brew install libreoffice

# Verify installation
which libreoffice
libreoffice --version
```

**Alternative solution for non-standard installation:**
```bash
# Find LibreOffice
find /usr -name libreoffice 2>/dev/null

# Create symlink
sudo ln -s /path/to/libreoffice /usr/local/bin/libreoffice
```

### 2. PDF Conversion Fails

**Error:**
```
pdf2image.exceptions.PDFInfoNotInstalledError: Unable to get page count.
```

**Cause:** poppler-utils not installed

**Solution:**
```bash
# Ubuntu/Debian/WSL
sudo apt-get install poppler-utils

# macOS
brew install poppler

# Verify
pdftoppm -v
```

### 3. Mistral API Key Issues

**Error:**
```
Error in validation:
Mistral API key is required.
```

**Solutions:**

**Check if key is set:**
```bash
echo $MISTRAL_API_KEY
```

**Set temporarily:**
```bash
export MISTRAL_API_KEY="your_key_here"
npm run ocr:convert -- presentation.pptx -o test
```

**Set permanently:**
```bash
# Bash
echo 'export MISTRAL_API_KEY="your_key_here"' >> ~/.bashrc
source ~/.bashrc

# Zsh
echo 'export MISTRAL_API_KEY="your_key_here"' >> ~/.zshrc
source ~/.zshrc
```

**Use inline:**
```bash
npm run ocr:convert -- presentation.pptx -o test --api-key "your_key_here"
```

### 4. API Authentication Failed

**Error:**
```
Error in ocr:
Authentication failed: Invalid API key
```

**Causes:**
- Incorrect API key
- API key expired
- API key quota exceeded

**Solutions:**

1. **Verify API key:**
   - Log in to https://console.mistral.ai
   - Check API Keys section
   - Generate new key if needed

2. **Test API key:**
   ```bash
   python3 << 'EOF'
   from mistralai import Mistral
   client = Mistral(api_key="your_key_here")
   print("API key valid!")
   EOF
   ```

3. **Check quota:**
   - Visit https://console.mistral.ai/billing
   - Check usage and limits

### 5. OCR Returns Empty Text

**Error:**
```
Warning: Failed to process slide X, using image only
```

**Causes:**
- Low image quality
- Non-text content
- API rate limiting

**Solutions:**

1. **Increase DPI:**
   ```bash
   npm run ocr:convert -- slides.pptx -o test --dpi 600
   ```

2. **Check image manually:**
   ```bash
   # Convert with temp files
   npm run ocr:convert -- slides.pptx -o test --keep-temp

   # Inspect images
   ls /tmp/marp-ocr-*/
   open /tmp/marp-ocr-*/slide-*.png
   ```

3. **Test OCR directly:**
   ```bash
   python3 scripts/utils/ocr/mistral-ocr.py \
     /tmp/marp-ocr-xxx/slide-01.png \
     "$MISTRAL_API_KEY" \
     pixtral-12b-2409
   ```

### 6. Rate Limit Exceeded

**Error:**
```
Error in ocr:
Rate limit exceeded: Too many requests
```

**Cause:** Too many API calls in short time

**Solutions:**

1. **Wait and retry:**
   ```bash
   # Wait 1 minute, then retry
   sleep 60
   npm run ocr:convert -- presentation.pptx -o test
   ```

2. **Process in batches:**
   ```bash
   # Split large PPTX into smaller files
   # Convert separately with delays
   ```

3. **Upgrade API plan:**
   - Visit https://console.mistral.ai/billing
   - Upgrade to higher tier

### 7. File Size Too Large

**Error:**
```
Warning: Large file detected (125.5MB). This may take a while...
```

**Cause:** PPTX file is very large

**Solutions:**

1. **Reduce file size in PowerPoint:**
   - Compress images
   - Remove hidden slides
   - Optimize media

2. **Use lower DPI:**
   ```bash
   npm run ocr:convert -- large.pptx -o test --dpi 150
   ```

3. **Split presentation:**
   ```bash
   # Manually split into multiple PPTX files
   npm run ocr:convert -- part1.pptx -o deck-part1
   npm run ocr:convert -- part2.pptx -o deck-part2
   ```

### 8. Conversion Timeout

**Error:**
```
Error in image-conversion:
LibreOffice conversion timed out after 2 minutes
```

**Cause:** Very large or complex PPTX

**Solutions:**

1. **Simplify presentation:**
   - Remove animations
   - Compress images
   - Reduce slide count

2. **Increase timeout** (requires code modification):
   ```python
   # Edit scripts/utils/ocr/pptx-to-images.py
   # Change timeout=120 to timeout=300
   ```

3. **Convert manually:**
   ```bash
   # Convert to PDF first
   libreoffice --headless --convert-to pdf presentation.pptx

   # Then convert PDF to images
   pdftoppm -png -r 300 presentation.pdf slide
   ```

### 9. Python Import Errors

**Error:**
```
ImportError: No module named 'mistralai'
```

**Cause:** Python dependencies not installed

**Solution:**
```bash
# Install dependencies
npm run ocr:install

# Or manually
pip3 install -r scripts/utils/ocr/requirements.txt

# Verify
python3 -c "import mistralai; print('OK')"
```

### 10. Output Deck Doesn't Render

**Error:**
```
Failed to render Marp slides
```

**Causes:**
- Malformed Markdown
- Missing images
- Invalid front-matter

**Solutions:**

1. **Check deck.md syntax:**
   ```bash
   cd decks/your-deck
   cat deck.md
   ```

2. **Verify images exist:**
   ```bash
   ls -lh assets/
   ```

3. **Test with Marp CLI:**
   ```bash
   cd decks/your-deck
   npm run dev
   # Check browser console for errors
   ```

4. **Validate front-matter:**
   ```yaml
   ---
   marp: true
   theme: default
   size: 16:9
   ---
   ```

### 11. OCR Text Incorrect

**Issue:** Extracted text doesn't match slides

**Causes:**
- Low image quality
- Complex fonts
- Poor contrast

**Solutions:**

1. **Increase DPI:**
   ```bash
   npm run ocr:convert -- slides.pptx -o test --dpi 600
   ```

2. **Use hybrid mode:**
   ```bash
   # Allows manual correction
   npm run ocr:convert -- slides.pptx -o test --strategy hybrid
   cd decks/test
   # Edit deck.md to fix errors
   ```

3. **Manual review:**
   ```bash
   # Convert with background mode
   npm run ocr:convert -- slides.pptx -o reference --strategy background

   # Convert with reconstruction
   npm run ocr:convert -- slides.pptx -o editable --strategy reconstruction

   # Compare and fix manually
   ```

### 12. Memory Issues

**Error:**
```
Killed
```
or
```
MemoryError
```

**Cause:** Not enough RAM for large images

**Solutions:**

1. **Reduce DPI:**
   ```bash
   npm run ocr:convert -- slides.pptx -o test --dpi 150
   ```

2. **Close other applications:**
   ```bash
   # Free up memory before conversion
   ```

3. **Process in batches:**
   ```bash
   # Split PPTX into smaller files
   ```

## Debugging Steps

### Enable Verbose Logging

Currently not implemented, but you can:

1. **Keep temporary files:**
   ```bash
   npm run ocr:convert -- slides.pptx -o test --keep-temp
   ```

2. **Inspect intermediate files:**
   ```bash
   ls -lh /tmp/marp-ocr-*/
   ```

3. **Test components separately:**
   ```bash
   # Test image conversion
   python3 scripts/utils/ocr/pptx-to-images.py \
     presentation.pptx \
     /tmp/test-output \
     300

   # Test OCR
   python3 scripts/utils/ocr/mistral-ocr.py \
     /tmp/test-output/slide-01.png \
     "$MISTRAL_API_KEY" \
     pixtral-12b-2409
   ```

### Check System Resources

```bash
# Disk space
df -h

# Memory
free -h

# CPU
top

# Network
ping -c 3 api.mistral.ai
```

## Getting Help

### Before Reporting Issues

1. **Run diagnostics:**
   ```bash
   # System check
   libreoffice --version
   pdftoppm -v
   python3 --version

   # Python packages
   pip3 list | grep -E "mistralai|Pillow|pdf2image"

   # API key
   echo ${MISTRAL_API_KEY:0:10}...  # First 10 chars
   ```

2. **Collect error messages:**
   ```bash
   npm run ocr:convert -- problem.pptx -o test 2>&1 | tee error.log
   ```

3. **Test with simple file:**
   - Create 3-slide PPTX with plain text
   - Try conversion
   - Determine if issue is specific to original file

### Report Issues

Include in your report:
- Operating system and version
- Node.js version (`node --version`)
- Python version (`python3 --version`)
- Error messages (full output)
- PPTX file characteristics (size, slide count)
- Command used

## Best Practices

### Preventive Measures

1. **Validate input before conversion:**
   ```bash
   # Check file exists and is readable
   file presentation.pptx

   # Check file size
   ls -lh presentation.pptx

   # Test in PowerPoint/LibreOffice first
   ```

2. **Start with small test:**
   ```bash
   # Test with first few slides
   # Create small sample PPTX
   npm run ocr:convert -- sample.pptx -o test --strategy background
   ```

3. **Monitor resources:**
   ```bash
   # Watch disk space
   df -h

   # Monitor memory during conversion
   watch -n 1 free -h
   ```

### Recovery

If conversion fails midway:

1. **Check temporary files:**
   ```bash
   ls /tmp/marp-ocr-*/
   ```

2. **Manually complete:**
   ```bash
   # If images were created but OCR failed:
   # Process images manually with mistral-ocr.py
   # Or use background mode with existing images
   ```

3. **Clean up:**
   ```bash
   # Remove partial output
   rm -rf decks/failed-deck

   # Clear temp files
   rm -rf /tmp/marp-ocr-*
   ```

## Next Steps

- Review [Usage Guide](./usage.md) for correct usage
- Check [Installation Guide](./installation.md) for setup
- See [Strategies Guide](./strategies.md) for choosing right mode
