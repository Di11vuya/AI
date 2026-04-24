import pandas as pd
from sklearn.linear_model import LogisticRegression
import pickle

print("Starting script...")

data = pd.read_csv(r"C:\Users\KJ Library 04\Desktop\disease-app\diabetes.csv")
print("Dataset loaded successfully!")

X = data.drop("Outcome", axis=1)
y = data["Outcome"]

model = LogisticRegression(max_iter=1000)
model.fit(X, y)

print("Model trained!")

pickle.dump(model, open("model.pkl", "wb"))

print("Model saved!")
