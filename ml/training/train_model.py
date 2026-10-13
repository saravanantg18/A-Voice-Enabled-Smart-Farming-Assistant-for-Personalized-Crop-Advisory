import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

# Sample agricultural dataset for crops suitable for Kerala and South Indian farming
# N: Nitrogen (0-140), P: Phosphorus (5-145), K: Potassium (5-205), temp: (15-40 C), humidity: (40-100%), ph: (3.5-9.0), rainfall: (50-3000 mm)

CROP_DATA_PROFILES = [
    # crop, N_min, N_max, P_min, P_max, K_min, K_max, temp_min, temp_max, hum_min, hum_max, ph_min, ph_max, rain_min, rain_max
    ("rice", 60, 90, 35, 60, 35, 45, 20, 33, 70, 95, 5.5, 7.2, 1800, 3000),
    ("coconut", 20, 50, 15, 40, 50, 100, 24, 34, 70, 90, 5.2, 7.5, 1300, 2500),
    ("banana", 80, 120, 70, 95, 110, 160, 24, 35, 75, 95, 6.0, 7.5, 1200, 2200),
    ("black_pepper", 30, 60, 20, 40, 40, 80, 20, 32, 75, 95, 5.0, 6.5, 2000, 3000),
    ("rubber", 40, 70, 30, 50, 30, 60, 22, 34, 70, 95, 4.5, 6.2, 2000, 3500),
    ("tapioca", 40, 70, 30, 50, 60, 90, 22, 35, 60, 85, 5.0, 6.8, 1000, 2000),
    ("cardamom", 20, 40, 25, 45, 30, 60, 15, 26, 80, 98, 5.5, 6.8, 1500, 3500),
    ("coffee", 30, 60, 20, 40, 30, 50, 18, 28, 70, 90, 5.0, 6.5, 1500, 2500),
    ("tea", 40, 70, 20, 35, 20, 40, 14, 25, 75, 95, 4.5, 5.8, 1500, 3000),
    ("maize", 70, 100, 40, 60, 15, 30, 18, 30, 55, 75, 5.8, 7.3, 600, 1100),
    ("ginger", 50, 80, 40, 65, 50, 80, 20, 32, 70, 90, 5.5, 6.8, 1500, 2500),
    ("turmeric", 50, 80, 30, 60, 60, 90, 20, 33, 70, 90, 5.5, 7.2, 1400, 2200),
    ("cashew", 20, 40, 15, 30, 20, 40, 22, 36, 50, 80, 5.0, 7.0, 800, 2000),
    ("arecanut", 40, 70, 20, 40, 40, 80, 20, 34, 70, 90, 5.2, 7.0, 1500, 3000),
]

def generate_dataset(samples_per_crop=150):
    rows = []
    np.random.seed(42)
    for crop, n_min, n_max, p_min, p_max, k_min, k_max, t_min, t_max, h_min, h_max, ph_min, ph_max, r_min, r_max in CROP_DATA_PROFILES:
        for _ in range(samples_per_crop):
            n = np.random.uniform(n_min, n_max)
            p = np.random.uniform(p_min, p_max)
            k = np.random.uniform(k_min, k_max)
            temp = np.random.uniform(t_min, t_max)
            hum = np.random.uniform(h_min, h_max)
            ph = np.random.uniform(ph_min, ph_max)
            rain = np.random.uniform(r_min, r_max)
            rows.append({
                'N': round(n, 2),
                'P': round(p, 2),
                'K': round(k, 2),
                'temperature': round(temp, 2),
                'humidity': round(hum, 2),
                'ph': round(ph, 2),
                'rainfall': round(rain, 2),
                'label': crop
            })
    return pd.DataFrame(rows)

def train():
    print("Generating sample agricultural dataset for model training...")
    df = generate_dataset(samples_per_crop=200)
    
    os.makedirs("ml/dataset", exist_ok=True)
    dataset_path = "ml/dataset/crop_recommendation.csv"
    df.to_csv(dataset_path, index=False)
    print(f"Dataset saved to {dataset_path} ({len(df)} records)")

    X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y = df['label']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)

    y_pred = rf_model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy on Test Set: {acc * 100:.2f}%")

    os.makedirs("ml/models", exist_ok=True)
    os.makedirs("backend/app/ml", exist_ok=True)
    
    model_path = "ml/models/crop_recommendation_model.pkl"
    joblib.dump(rf_model, model_path)
    joblib.dump(rf_model, "backend/app/ml/crop_recommendation_model.pkl")
    print(f"Model saved to {model_path} and backend/app/ml/")

if __name__ == "__main__":
    train()
