from sklearn.linear_model import LinearRegression
import numpy as np


def predict_demand(sales_data):

    # Days
    X = np.array(range(len(sales_data))).reshape(-1, 1)

    # Sales values
    y = np.array(sales_data)

    # Train model
    model = LinearRegression()
    model.fit(X, y)

    # Predict next day
    next_day = np.array([[len(sales_data)]])

    prediction = model.predict(next_day)

    return round(prediction[0], 2)
