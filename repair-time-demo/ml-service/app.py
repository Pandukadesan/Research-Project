import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load the trained model pipeline
model = joblib.load('repair_time_pipeline.pkl')

def convert_hours_to_time(hours):
    """
    Convert decimal hours to hours and minutes format
    Example: 2.61 -> "2 hours 37 minutes"
    """
    total_hours = int(hours)
    remaining_minutes = round((hours - total_hours) * 60)
    
    # Handle edge case where rounding gives 60 minutes
    if remaining_minutes == 60:
        total_hours += 1
        remaining_minutes = 0
    
    # Build the time string
    if total_hours == 0:
        return f"{remaining_minutes} minutes"
    elif total_hours == 1:
        if remaining_minutes == 0:
            return "1 hour"
        else:
            return f"1 hour {remaining_minutes} minutes"
    else:
        if remaining_minutes == 0:
            return f"{total_hours} hours"
        else:
            return f"{total_hours} hours {remaining_minutes} minutes"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # 1️⃣ Get JSON input from request
        data = request.json

        # 2️⃣ Convert JSON to DataFrame
        input_df = pd.DataFrame([data])

        # 3️⃣ Predict using the full pipeline
        raw_prediction = model.predict(input_df)[0]
        
        # Round to 2 decimal places
        clean_prediction = round(raw_prediction, 2)
        
        # Convert to hours and minutes format
        formatted_time = convert_hours_to_time(clean_prediction)

        return jsonify({
            "estimated_repair_time": float(clean_prediction),  # Keep original for reference
            "formatted_time": formatted_time  # New formatted version
        })
        
    except Exception as e:
        # Catch errors to debug easily
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)