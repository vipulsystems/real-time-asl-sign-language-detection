from collections import deque
from app.services.translator import translate_sign

# State management
current_sentence = ""
prediction_buffer = deque(maxlen=8) # Increased for better smoothing
last_confirmed_letter = None


def clear_sentence():
    global current_sentence, last_confirmed_letter
    current_sentence = ""
    last_confirmed_letter = None
    prediction_buffer.clear()

def update_sentence(sign):
    global current_sentence, last_confirmed_letter
    
    command = translate_sign(sign)
    
    if not command:
        last_confirmed_letter = None
        return current_sentence

    # HANDLE FUNCTIONAL COMMANDS
    if command == "DELETE":
        if last_confirmed_letter != "DELETE": # Prevent rapid-fire deletion
            current_sentence = current_sentence[:-1]
            last_confirmed_letter = "DELETE"
        return current_sentence
        
    if command == "RESET":
        current_sentence = ""
        return current_sentence

    # HANDLE STANDARD TYPING
    # (Existing confirmation logic here...)
    if command != last_confirmed_letter:
        current_sentence += command
        last_confirmed_letter = command
        
    return current_sentence

