import re

def validate_extracted_data(data: dict) -> list:
    """
    Applies business rules to the AI extracted data.
    Returns a list of validation flags (strings).
    """
    flags = []
    
    # Check for missing critical fields
    critical_fields = ['owner_name', 'survey_number', 'area', 'district']
    for field in critical_fields:
        if not data.get(field) or data.get(field) == "Not detected" or str(data.get(field)).strip() == "":
            flags.append(f"Missing critical field: {field.replace('_', ' ').title()}")

    # Check if area looks like a valid number > 0
    area = data.get('area')
    if area and str(area).lower() != "not detected":
        # Extract digits and decimal point
        numbers = re.findall(r"[-+]?\d*\.\d+|\d+", str(area))
        if numbers:
            try:
                area_value = float(numbers[0])
                if area_value <= 0:
                    flags.append("Area must be greater than zero.")
            except ValueError:
                flags.append("Area format is invalid.")
        else:
             flags.append("Area must contain a valid number.")

    return flags
