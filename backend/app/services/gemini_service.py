import google.generativeai as genai
import json
import PIL.Image
from app.core.config import settings

def initialize_gemini():
    if not settings.gemini_api_key:
        raise ValueError("GEMINI_API_KEY is not set")
    genai.configure(api_key=settings.gemini_api_key)

def extract_structured_data(local_path: str) -> dict:
    """
    Sends the document image directly to Gemini 3.8 Flash to extract structured land record data natively.
    """
    initialize_gemini()
    
    # We use gemini-3.7-flash as the latest supported model
    model = genai.GenerativeModel('gemini-3.7-flash')
    
    prompt = f"""
    You are an expert AI assistant specialized in digitizing Indian land records (7/12 extracts, Khasra, Khatauni, etc.).
    
    FIRST, analyze if the provided image is a valid Indian land record document. If it is a completely unrelated image (like a selfie, car, random receipt, ID card, or blank paper), you MUST set "is_valid_document": false and set ALL other fields to null.
    If it appears to be a valid land record (even if damaged or hard to read), set "is_valid_document": true and proceed with extraction.

    Extract the following entities from the provided land record image.
    If a field is not found or unreadable, set its value to null.
    Do not hallucinate or guess information.

    For every field (except is_valid_document), extract it as an object containing BOTH the 'original' text exactly as written in the source language (e.g. Marathi/Hindi), AND the 'english' translation.
    Example: "owner_name": {{ "original": "संतोष वसंतराव काळे", "english": "Santosh Vasantrao Kale" }}

    Required Fields:
    - is_valid_document: boolean (true if valid land record, false otherwise)
    - owner_name: The name of the land owner(s).
    - survey_number: Survey number or Khasra number.
    - area: The total area of the land (include units if present).
    - village: Village name.
    - tehsil: Tehsil or Taluka name.
    - district: District name.
    - state: State name (if not explicitly written, infer from context if 100% certain, otherwise null).

    Respond STRICTLY with a valid JSON object matching this schema. No markdown blocks, just raw JSON.
    """
    
    try:
        img = PIL.Image.open(local_path)
        
        response = model.generate_content(
            [prompt, img],
            generation_config=genai.types.GenerationConfig(
                temperature=0.1,
                response_mime_type="application/json",
            ),
        )
        
        # Parse the JSON response
        result = json.loads(response.text)
        return result
    except Exception as e:
        print(f"Gemini Extraction Error: {e}")
        return {
            "error": str(e),
            "owner_name": None,
            "survey_number": None,
            "area": None,
            "village": None,
            "tehsil": None,
            "district": None,
            "state": None
        }
