from flask import Flask, request, render_template
import pickle
import numpy as np

app = Flask(__name__)

# Load trained model
model = pickle.load(open("model.pkl", "rb"))

# Home page
@app.route("/")
def home():
    return render_template("index.html")

# Prediction route
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get form values
        data = [float(x) for x in request.form.values()]

        # Convert to numpy array and predict
        prediction = model.predict([np.array(data)])[0]
        probability = model.predict_proba([np.array(data)])[0]

        # Result logic
        result = "Diabetic" if prediction == 1 else "Not Diabetic"
        confidence = float(probability[prediction]) * 100

        return render_template("index.html", prediction_text=result, confidence=round(confidence, 2))

    except Exception as e:
        return render_template("index.html", prediction_text=f"Error: {e}", confidence=0)

# Run app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000, debug=True)

