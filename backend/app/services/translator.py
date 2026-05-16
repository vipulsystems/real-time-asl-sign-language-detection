def translate_sign(sign):
    """
    Maps detected gestures to characters, words, or system commands.
    """

    if not sign:
        return None

    sign = str(sign).upper()

    mapping = {
        # 🔤 Alphabets
        **{chr(i): chr(i) for i in range(65, 91)},  # A-Z

        # 🔧 Functional Commands
        "SPACE": " ",
        "BACKSPACE": "DELETE",
        "CLEAR": "RESET",

        # 🔥 Special Gestures (future-ready)
        "THUMBS_UP": "All the Best 👍",
        "ILY": "I Love You ❤️",
        "HELLO": "Hello 👋",
        "THANKYOU": "Thank You 🙏",
        "NAMASTE": "Namaste 🙏"
    }

    return mapping.get(sign, None)