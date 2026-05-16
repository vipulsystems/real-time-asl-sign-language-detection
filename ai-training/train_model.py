import cv2
import mediapipe as mp
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True)

DATASET_PATH = "dataset"

X, y = [], []

for label in os.listdir(DATASET_PATH):
    folder = os.path.join(DATASET_PATH, label)
    if not os.path.isdir(folder):
        continue

    for img_name in os.listdir(folder)[:200]:
        path = os.path.join(folder, img_name)
        img = cv2.imread(path)
        if img is None:
            continue

        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        res = hands.process(rgb)

        if not res.multi_hand_landmarks:
            continue

        lm = res.multi_hand_landmarks[0]

        # normalize landmarks (important for consistency)
        xs = [p.x for p in lm.landmark]
        ys = [p.y for p in lm.landmark]
        min_x, min_y = min(xs), min(ys)

        features = []
        for p in lm.landmark:
            features.append(p.x - min_x)
            features.append(p.y - min_y)

        X.append(features)
        y.append(label)

print("Samples:", len(X))

model = RandomForestClassifier(n_estimators=150)
model.fit(X, y)

os.makedirs("../backend/app/models", exist_ok=True)
joblib.dump(model, "../backend/app/models/landmark_model.pkl")

print("✅ Saved: backend/app/models/landmark_model.pkl")