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
        prediction_buffer.clear()
        last_confirmed_letter = None
        return current_sentence

    # 🔥 ADD TO BUFFER
    prediction_buffer.append(command)

    # 🔥 STABILITY CHECK
    if len(prediction_buffer) < prediction_buffer.maxlen:
        return current_sentence

    stable = max(set(prediction_buffer), key=prediction_buffer.count)

    # 🔥 HANDLE COMMANDS
    if stable == "DELETE":
        if last_confirmed_letter != "DELETE":
            current_sentence = current_sentence[:-1]
            last_confirmed_letter = "DELETE"
        prediction_buffer.clear()
        return current_sentence

    if stable == "RESET":
        current_sentence = ""
        prediction_buffer.clear()
        return current_sentence

    # 🔥 ADD LETTER ONLY IF NEW
    if stable != last_confirmed_letter:
        current_sentence += stable
        last_confirmed_letter = stable
        prediction_buffer.clear()

    return current_sentence

