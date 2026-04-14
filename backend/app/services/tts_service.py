from gtts import gTTS
import uuid
import os
import glob
import time

# Ensure the static directory exists on startup
STATIC_DIR = "static"
if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR)

def cleanup_old_audio(max_age_seconds=60):
    """Deletes audio files older than 1 minute to save disk space."""
    now = time.time()
    for f in glob.glob(os.path.join(STATIC_DIR, "*.mp3")):
        if os.stat(f).st_mtime < now - max_age_seconds:
            try:
                os.remove(f)
            except OSError:
                pass

def speak(text):
    # 1. Validation
    if not text or not text.strip():
        return None

    # 2. Cleanup old files before generating a new one
    cleanup_old_audio()

    try:
        # 3. Generate unique filename
        filename = f"speech_{uuid.uuid4().hex[:8]}.mp3"
        path = os.path.join(STATIC_DIR, filename)

        # 4. Generate Speech
        tts = gTTS(text=text, lang='en')
        tts.save(path)

        return filename
    except Exception as e:
        print(f"TTS Error: {e}")
        return None