import cv2
import numpy as np
from app.core.model_loader import get_model
from collections import deque
import mediapipe as mp

# Buffer to smooth out flickering predictions
prediction_buffer = deque(maxlen=5)
model = get_model()

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False, 
    max_num_hands=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Ensure this list matches your model's training classes exactly
# If your model has 27 outputs, add "Background" or "Space" at the start or end
classes = [
    "A","B","C","D","E","F","G","H","I","J","K","L","M",
    "N","O","P","Q","R","S","T","U","V","W","X","Y","Z"
]

def detect_sign(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if image is None:
        return "Invalid Image", 0

    h, w, _ = image.shape
    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb)

    if not results.multi_hand_landmarks:
        prediction_buffer.append("No hand")
        return "No hand", 0

    # DYNAMIC CROP LOGIC
    landmarks = results.multi_hand_landmarks[0]
    x_coords = [lm.x for lm in landmarks.landmark]
    y_coords = [lm.y for lm in landmarks.landmark]

    x_min, x_max = int(min(x_coords) * w), int(max(x_coords) * w)
    y_min, y_max = int(min(y_coords) * h), int(max(y_coords) * h)

    # Padding to give the AI a better view
    offset = 40
    y1, y2 = max(0, y_min - offset), min(h, y_max + offset)
    x1, x2 = max(0, x_min - offset), min(w, x_max + offset)

    crop = image[y1:y2, x1:x2]
    if crop.size == 0: return "No hand", 0

    # PREPROCESSING (Adjust to 64x64 or 224x224 based on your model)
    crop = cv2.resize(crop, (64, 64))
    input_img = crop.astype("float32") / 255.0
    input_img = np.expand_dims(input_img, axis=0) 

    # PREDICTION
    prediction = model.predict(input_img, verbose=0)
    index = np.argmax(prediction)
    confidence = float(np.max(prediction))

    # DEFENSIVE CHECK: This prevents the IndexError
    if index < len(classes):
        sign = classes[index]
    else:
        sign = "Unknown"
        print(f"⚠️ Index {index} out of range for class list!")

    prediction_buffer.append(sign)
    stable_sign = max(set(prediction_buffer), key=prediction_buffer.count)

    return stable_sign, confidence