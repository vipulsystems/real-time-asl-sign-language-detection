import cv2
import numpy as np
import mediapipe as mp
import joblib
from collections import deque

model = joblib.load("app/models/landmark_model.pkl")

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

buffer = deque(maxlen=5)

def detect_landmark_sign(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if image is None:
        return "Invalid", 0.0

    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    res = hands.process(rgb)

    if not res.multi_hand_landmarks:
        buffer.append("No hand")
        return "No hand", 0.0

    lm = res.multi_hand_landmarks[0]

    # normalize (important)
    xs = [p.x for p in lm.landmark]
    ys = [p.y for p in lm.landmark]
    min_x, min_y = min(xs), min(ys)

    features = []
    for p in lm.landmark:
        features.append(p.x - min_x)
        features.append(p.y - min_y)

    pred = model.predict([features])[0]

    buffer.append(pred)
    stable = max(set(buffer), key=buffer.count)

    return stable, 1.0