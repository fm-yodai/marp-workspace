#!/usr/bin/env python3
"""
Process images with Mistral Vision/OCR API
"""
import base64
import json
import sys
from pathlib import Path
from mistralai import Mistral


def encode_image(image_path: str) -> str:
    """
    Encode image file to base64 string.

    Args:
        image_path: Path to image file

    Returns:
        Base64 encoded string
    """
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')


def process_slide_ocr(image_path: str, api_key: str, model: str = "pixtral-12b-2409"):
    """
    Process a single slide image with Mistral OCR API.

    Args:
        image_path: Path to slide image
        api_key: Mistral API key
        model: Model to use for OCR

    Returns:
        JSON string with OCR results
    """
    try:
        # Verify image exists
        image_path_obj = Path(image_path).resolve()
        if not image_path_obj.exists():
            raise FileNotFoundError(f"Image file not found: {image_path}")

        # Initialize Mistral client
        client = Mistral(api_key=api_key)

        # Encode image
        base64_image = encode_image(str(image_path_obj))

        # Prepare messages for OCR
        # Request structured markdown output with layout preservation
        messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """Extract all text from this slide image and convert it to clean Markdown format.

Requirements:
1. Preserve the hierarchical structure (titles, headings, bullet points)
2. Use appropriate Markdown syntax:
   - # for main titles
   - ## for section headings
   - ### for sub-headings
   - - for bullet points
   - 1. for numbered lists
3. Maintain the reading order (top to bottom, left to right)
4. Include any visible text from charts, diagrams, or tables
5. Do NOT include descriptions of images or visual elements
6. Output ONLY the Markdown text, no explanations

If the slide has no text, return an empty string."""
                    },
                    {
                        "type": "image_url",
                        "image_url": f"data:image/png;base64,{base64_image}"
                    }
                ]
            }
        ]

        # Call Mistral API
        response = client.chat.complete(
            model=model,
            messages=messages
        )

        # Extract text from response
        markdown_text = response.choices[0].message.content

        # Get image dimensions
        from PIL import Image
        with Image.open(str(image_path_obj)) as img:
            width, height = img.size

        # Return structured result
        result = {
            "success": True,
            "markdown": markdown_text.strip(),
            "dimensions": {
                "width": width,
                "height": height
            },
            "model": model
        }

        print(json.dumps(result, ensure_ascii=False))
        return 0

    except FileNotFoundError as e:
        error_result = {
            "success": False,
            "error": "FileNotFoundError",
            "message": str(e)
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
            "Usage: mistral-ocr.py <image_path> <api_key> <model>",
            file=sys.stderr
        )
        return 1

    image_path = sys.argv[1]
    api_key = sys.argv[2]
    model = sys.argv[3]

    return process_slide_ocr(image_path, api_key, model)


if __name__ == "__main__":
    sys.exit(main())
