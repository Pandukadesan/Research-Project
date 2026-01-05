#6000
import joblib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import pandas as pd

app = FastAPI()

save = joblib.load(r"/Users/panduka.deshanicloud.com/Desktop/Mileage Fraud Detection/ml-service/price_variation_model4.pkl")

model = save["model"]
scaler = save["scaler"]
df = pd.DataFrame({
    "date": pd.to_datetime(save["dates"]),
    "price": save["prices"],
    "partname": save["partname"],
    "part_id": save["partid"]
})

df = df.sort_values(["part_id", "date"]).reset_index(drop=True)
TIME_STEPS = 10  # Must match your training

 

# Ensure no duplicate index issues
 

# Input schema
class PredictInput(BaseModel):
    date: str
    partname: str
 # e.g., "2024-06-01"

@app.post("/predict3")
def predict_price(data: PredictInput):
    input_date = pd.to_datetime(data.date)

    # Filter by partname
    part_df = df[df["partname"] == data.partname]

    if part_df.empty:
        raise HTTPException(
            status_code=404,
            detail=f"Part '{data.partname}' not found"
        )

    # Filter historical data
    past_data = part_df[part_df["date"] < input_date]

    if len(past_data) < TIME_STEPS:
        raise HTTPException(
            status_code=400,
            detail=f"Need at least {TIME_STEPS} historical records for {data.partname}"
        )

    # Get last prices
    last_prices = past_data["price"].iloc[-TIME_STEPS:].values.reshape(-1, 1)

    # Scale prices
    last_prices_scaled = scaler.transform(last_prices)

    # Get part_id
    pid = past_data["part_id"].iloc[-1]

    # Build LSTM input (price + part_id)
    X = np.array([[ [last_prices_scaled[i][0], pid] for i in range(TIME_STEPS) ]])

    # Predict
    pred_scaled = model.predict(X)

    # Inverse scale
    predicted_price = scaler.inverse_transform(pred_scaled)[0][0]

    return {
        "partname": data.partname,
        "input_date": data.date,
        "predicted_price": float(predicted_price)
    }