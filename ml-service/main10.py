#6002
import joblib
from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd

# ---------------- CREATE APP ----------------
app = FastAPI()

# ---------------- LOAD MODEL ----------------
saved = joblib.load(r"/Users/panduka.deshanicloud.com/Desktop/Mileage Fraud Detection/ml-service/part_price_model7.pkl")

if isinstance(saved, dict):
    model = saved.get("model")
    feature_columns = saved.get("feature_columns")
else:
    model = saved
    feature_columns = None

# ---------------- INPUT SCHEMA ----------------
class FaultInput(BaseModel):
    FaultCategory: str
    FaultCode: str
    Region: str
    Partscost: float  # ✅ changed from int to float

# ---------------- ROUTE ----------------
@app.post("/predictcost")
def predict_cost(data: FaultInput):
    # Convert input to DataFrame
    df = pd.DataFrame([data.dict()])

    # One-hot encode categorical columns
    encoded = pd.get_dummies(df)

    # Ensure all model features exist
    for col in model.feature_names_in_:
        if col not in encoded.columns:
            encoded[col] = 0

    # Reorder columns to match model
    encoded = encoded[model.feature_names_in_]

    # Predict
    prediction = model.predict(encoded)
    return {"predicted_cost": float(prediction[0])}
