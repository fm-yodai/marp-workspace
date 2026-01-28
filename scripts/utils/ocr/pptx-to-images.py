#!/usr/bin/env python3
"""
Convert PPTX to PNG images (one per slide)
Strategy: PPTX → PDF → PNG using LibreOffice and pdf2image
"""
import subprocess
import tempfile
import json
import sys
import platform
import shutil
from pathlib import Path
from pdf2image import convert_from_path


def find_libreoffice_command():
    """
    Find LibreOffice executable on the system.
    Returns the command name or path, or raises RuntimeError if not found.
    """
    system = platform.system()

    # Define candidates based on platform
    if system == 'Windows':
        candidates = [
            'soffice.exe',
            'soffice',
            r'C:\Program Files\LibreOffice\program\soffice.exe',
            r'C:\Program Files (x86)\LibreOffice\program\soffice.exe',
        ]
    elif system == 'Darwin':  # macOS
        candidates = [
            '/Applications/LibreOffice.app/Contents/MacOS/soffice',
            'libreoffice',
            'soffice',
        ]
    else:  # Linux and others
        candidates = [
            'libreoffice',
            'soffice',
        ]

    # Try each candidate
    for candidate in candidates:
        # Check if it's a full path
        if Path(candidate).exists():
            return candidate

        # Check if it's in PATH
        if shutil.which(candidate):
            return candidate

    # Not found
    raise RuntimeError(
        f"LibreOffice not found. Please install LibreOffice for {system}.\n"
        "Visit https://www.libreoffice.org/download/"
    )


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
            # Find LibreOffice executable
            libreoffice_exe = find_libreoffice_command()

            # Use headless mode with no splash screen
            libreoffice_cmd = [
                libreoffice_exe,
                "--headless",
                "--convert-to", "pdf",
                "--outdir", temp_dir,
                str(pptx_path_obj)
            ]

            # Windows may need longer timeout for first run
            timeout = 180 if platform.system() == 'Windows' else 120

            result = subprocess.run(
                libreoffice_cmd,
                capture_output=True,
                text=True,
                timeout=timeout
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
        timeout_msg = "LibreOffice conversion timed out (3 minutes on Windows, 2 minutes on other systems). The file may be too large or complex."
        error_result = {
            "success": False,
            "error": "TimeoutError",
            "message": timeout_msg
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
