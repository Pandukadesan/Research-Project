from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image

# Initialize Flask app
app = Flask(__name__)

# Load your trained model
MODEL_PATH = "tyre_condition_model.h5"
model = load_model(MODEL_PATH)

# Define class labels
class_labels = {0: "defective", 1: "good"}

# Test endpoint
@app.route('/')
def home():
    return "Hello, World!"

# Prediction endpoint
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:
        # Load image from memory
        img = Image.open(file.stream).convert("RGB")  # ensures 3 channels
        img = img.resize((224, 224))                  # resize to model input
        img_array = np.array(img) / 255.0             # normalize
        img_array = np.expand_dims(img_array, axis=0) # add batch dimension

        # Make prediction
        pred = model.predict(img_array)
        pred_class = int(round(pred[0][0]))          # for sigmoid output
        result = class_labels[pred_class]

        return jsonify({"prediction": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
