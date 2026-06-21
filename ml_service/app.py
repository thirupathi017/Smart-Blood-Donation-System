from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np

app = FastAPI(title="BloodLink ML Prediction Service")

# Load models
try:
    availability_model = joblib.load('availability_model.joblib')
    next_donation_model = joblib.load('next_donation_model.joblib')
    bg_encoder = joblib.load('blood_group_encoder.joblib')
except Exception as e:
    print(f"Error loading models: {e}. Please run train_models.py first.")

class DonorFeatures(BaseModel):
    age: int
    blood_group: str
    total_donations: int
    days_since_last_donation: int
    feeling_healthy: bool
    reputation_score: int

class PredictionResponse(BaseModel):
    is_available: bool
    availability_probability: float
    estimated_days_until_next_donation: int

@app.post("/api/predict", response_model=PredictionResponse)
def predict(donor: DonorFeatures):
    try:
        # Encode blood group
        if donor.blood_group not in bg_encoder.classes_:
            bg_encoded = 0
        else:
            bg_encoded = bg_encoder.transform([donor.blood_group])[0]

        feeling_healthy_int = 1 if donor.feeling_healthy else 0

        # Create feature array
        features = [[
            donor.age,
            bg_encoded,
            donor.total_donations,
            donor.days_since_last_donation,
            feeling_healthy_int,
            donor.reputation_score
        ]]

        # Predict Availability
        avail_pred = availability_model.predict(features)[0]
        avail_prob = availability_model.predict_proba(features)[0][1]

        # Predict Days
        days_pred = next_donation_model.predict(features)[0]
        days_pred = max(0, int(round(days_pred)))

        return PredictionResponse(
            is_available=bool(avail_pred),
            availability_probability=round(float(avail_prob), 2),
            estimated_days_until_next_donation=days_pred
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
