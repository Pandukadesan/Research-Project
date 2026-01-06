import pandas as pd
from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Make sure this is the pipeline, not just the trained RandomForest
model = joblib.load('repair_time_pipeline.pkl')  

@app.route('/predict', methods=['POST'])
def predict():
    # 1️⃣ Get JSON input from request
    data = request.json

    # 2️⃣ Convert JSON to DataFrame
    input_df = pd.DataFrame([data])

    # 3️⃣ Predict using the full pipeline
    try:
        prediction = model.predict(input_df)[0]
        return jsonify({"estimated_repair_time": float(prediction)})
    except Exception as e:
        # Catch errors to debug easily
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
