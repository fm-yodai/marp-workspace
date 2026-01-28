#!/usr/bin/env python3
"""
Convert PPTX to PNG images (one per slide)
Strategy: PPTX → PDF → PNG using LibreOffice and pdf2image
"""
import subprocess
import tempfile
import json
import sys
from pathlib import Path
from pdf2image import convert_from_path


def convert_pptx_to_images(pptx_path: str, output_dir: str, dpi: int = 300):
    """
    Convert PPTX file to PNG images, one per slide.

    Args:
        pptx_path: Path to input PPTX file
        output_dir: Directory to save PNG images
        dpi: Resolution for PNG output (default: 300)

    Returns:
        JSON string with conversion results
    """
    try:
        pptx_path_obj = Path(pptx_path).resolve()
        output_dir_obj = Path(output_dir).resolve()
        output_dir_obj.mkdir(parents=True, exist_ok=True)

        # Verify input file exists
        if not pptx_path_obj.exists():
            raise FileNotFoundError(f"Input file not found: {pptx_path}")

        # Create temporary directory for PDF
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_pdf = Path(temp_dir) / "presentation.pdf"

            # Step 1: Convert PPTX to PDF using LibreOffice
            # Use headless mode with no splash screen
            libreoffice_cmd = [
                "libreoffice",
                "--headless",
                "--convert-to", "pdf",
                "--outdir", temp_dir,
                str(pptx_path_obj)
            ]

            result = subprocess.run(
                libreoffice_cmd,
                capture_output=True,
                text=True,
                timeout=120  # 2 minute timeout
            )

            if result.returncode != 0:
                raise RuntimeError(
                    f"LibreOffice conversion failed: {result.stderr}"
                )

            # Find the generated PDF (LibreOffice uses original filename)
            pdf_files = list(Path(temp_dir).glob("*.pdf"))
            if not pdf_files:
                raise RuntimeError("LibreOffice did not generate PDF file")

            temp_pdf = pdf_files[0]

            # Step 2: Convert PDF to PNG images using pdf2image
            images = convert_from_path(
                str(temp_pdf),
                dpi=dpi,
                fmt='png'
            )

            # Step 3: Save images with sequential naming
            image_paths = []
            for idx, image in enumerate(images, start=1):
                filename = f"slide-{idx:02d}.png"
                image_path = output_dir_obj / filename
                image.save(str(image_path), 'PNG')
                image_paths.append(str(image_path))

            # Return results as JSON
            result = {
                "success": True,
                "images": image_paths,
                "count": len(image_paths),
                "dpi": dpi
            }

            print(json.dumps(result))
            return 0

    except FileNotFoundError as e:
        error_result = {
            "success": False,
            "error": "FileNotFoundError",
            "message": str(e)
        }
        print(json.dumps(error_result), file=sys.stderr)
        return 1

    except subprocess.TimeoutExpired:
        error_result = {
            "success": False,
            "error": "TimeoutError",
            "message": "LibreOffice conversion timed out after 2 minutes"
        }
        print(json.dumps(error_result), file=sys.stderr)
        return 1

    except Exception as e:
        error_result = {
            "success": False,
            "error": type(e).__name__,
            "message": str(e)
        }
        print(json.dumps(error_result), file=sys.stderr)
        return 1


def main():
    if len(sys.argv) != 4:
        print(
            "Usage: pptx-to-images.py <pptx_path> <output_dir> <dpi>",
            file=sys.stderr
        )
        return 1

    pptx_path = sys.argv[1]
    output_dir = sys.argv[2]
    dpi = int(sys.argv[3])

    return convert_pptx_to_images(pptx_path, output_dir, dpi)


if __name__ == "__main__":
    sys.exit(main())
