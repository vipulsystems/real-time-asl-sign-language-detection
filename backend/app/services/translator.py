def translate_sign(sign):
    """
    Maps detected gestures to characters or system commands.
    """
    
    # This dictionary can be expanded to include whole words 
    # if your model is trained on ASL Word signs.
    asl_dict = {
        "A": "A", "B": "B", "C": "C", "D": "D", "E": "E",
        "F": "F", "G": "G", "H": "H", "I": "I", "J": "J",
        "K": "K", "L": "L", "M": "M", "N": "N", "O": "O",
        "P": "P", "Q": "Q", "R": "R", "S": "S", "T": "T",
        "U": "U", "V": "V", "W": "W", "X": "X", "Y": "Y",
        "Z": "Z",
        
        # Mapping specific "static" letters to functional commands
        "SPACE": " ",
        "BACKSPACE": "DELETE",
        "CLEAR": "RESET"
    }

    # Use .upper() to ensure we match the dictionary keys
    result = asl_dict.get(str(sign).upper(), None)
    
    return result