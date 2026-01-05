#6001
import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel

# --------------------------------------------------
# CREATE FASTAPI APP
# --------------------------------------------------
app = FastAPI(title="Parts Prediction API")

# --------------------------------------------------
# LOAD MODEL, ENCODER, FEATURES
# --------------------------------------------------
saved = joblib.load(r"/Users/panduka.deshanicloud.com/Desktop/Mileage Fraud Detection/ml-service/price_variation_model9.pkl")

model = saved["model"]
encoder = saved["encoder"]  # ✅ SAME encoder used in training

# --------------------------------------------------
# INPUT SCHEMA
# --------------------------------------------------
class PartsInput(BaseModel):
    FaultName: str
    FaultCode: str

# --------------------------------------------------
# PREDICTION ENDPOINT
# --------------------------------------------------
@app.post("/predictparts6")
def predict_parts(data: PartsInput):
    # Convert input to DataFrame (same column order as training)
    df = pd.DataFrame([[data.FaultName, data.FaultCode]],
                      columns=["FaultName", "FaultCode"])

    # Encode using TRAINED encoder
    X_encoded = encoder.transform(df)

    # Predict
    prediction = model.predict(X_encoded)

    return {
        "predicted_part_needed": prediction[0]
    }
