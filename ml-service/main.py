from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import os

# Initialize Flask app
app = Flask(__name__)

# ----------------------------
# Paths to your trained models
# ----------------------------
TYRE_MODEL_PATH = "tyre_condition_model.h5"
BODY_MODEL_PATH = "body_condition_model.keras"

# ----------------------------
# Load models
# ----------------------------
try:
    tyre_model = tf.keras.models.load_model(TYRE_MODEL_PATH)
    print("✓ Tyre model loaded successfully")
except Exception as e:
    print(f"✗ Failed to load tyre model: {e}")
    tyre_model = None

try:
    body_model = tf.keras.models.load_model(BODY_MODEL_PATH)
    print("✓ Body condition model loaded successfully")
except Exception as e:
    print(f"✗ Failed to load body model: {e}")
    body_model = None

# ----------------------------
# Class labels
# ----------------------------
TYRE_LABELS = {0: "defective", 1: "good"}
BODY_LABELS = {0: "damaged", 1: "good"}

# ----------------------------
# Helper function to preprocess images
# ----------------------------
def preprocess_image(file):
    img = Image.open(file.stream).convert("RGB")
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# ----------------------------
# Home endpoint
# ----------------------------
@app.route('/')
def home():
    return "Hello, World! Vehicle AI Detection API"

# ----------------------------
# Health check endpoint
# ----------------------------
@app.route('/health')
def health():
    return jsonify({
        "status": "ok",
        "tyre_model": "loaded" if tyre_model else "not loaded",
        "body_model": "loaded" if body_model else "not loaded"
    })

# ----------------------------
# Tyre prediction endpoint
# ----------------------------
@app.route("/predict/tyre", methods=["POST"])
def predict_tyre():
    if tyre_model is None:
        return jsonify({"error": "Tyre model not loaded"}), 500

    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:
        img_array = preprocess_image(file)
        pred = tyre_model.predict(img_array, verbose=0)
        pred_value = float(pred[0][0])

        if pred_value > 0.5:
            result = "good"
            confidence = pred_value
        else:
            result = "defective"
            confidence = 1 - pred_value

        return jsonify({
            "prediction": result,
            "confidence": round(confidence, 4),
            "raw_output": round(pred_value, 4)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ----------------------------
# Body condition prediction endpoint
# ----------------------------
@app.route("/predict/body", methods=["POST"])
def predict_body():
    if body_model is None:
        return jsonify({"error": "Body model not loaded"}), 500

    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:
        img_array = preprocess_image(file)
        pred = body_model.predict(img_array, verbose=0)
        pred_value = float(pred[0][0])

        if pred_value < 0.5:
            result = "damaged"
            confidence = 1 - pred_value
        else:
            result = "good"
            confidence = pred_value

        return jsonify({
            "prediction": result,
            "confidence": round(confidence, 4),
            "raw_output": round(pred_value, 4)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ----------------------------
# Run server
# ----------------------------
if __name__ == "__main__":
    print("=" * 50)
    print("Vehicle Detection Server Starting...")
    print(f"TensorFlow version: {tf.__version__}")
    print(f"Tyre model status: {'LOADED' if tyre_model else 'NOT LOADED'}")
    print(f"Body model status: {'LOADED' if body_model else 'NOT LOADED'}")
    print("=" * 50)
    app.run(host="0.0.0.0", port=5001, debug=True)
