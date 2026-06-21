import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Set random seed for reproducibility
np.random.seed(42)

def generate_synthetic_data(n_samples=1000):
    # Features
    age = np.random.randint(18, 65, n_samples)
    blood_groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    blood_group = np.random.choice(blood_groups, n_samples)
    total_donations = np.random.randint(0, 20, n_samples)
    days_since_last_donation = np.random.randint(10, 365, n_samples)
    feeling_healthy = np.random.choice([0, 1], n_samples, p=[0.1, 0.9])
    reputation_score = np.random.randint(50, 150, n_samples)

    # DataFrame
    df = pd.DataFrame({
        'age': age,
        'blood_group': blood_group,
        'total_donations': total_donations,
        'days_since_last_donation': days_since_last_donation,
        'feeling_healthy': feeling_healthy,
        'reputation_score': reputation_score
    })

    # Encode Blood Group
    le = LabelEncoder()
    df['blood_group_encoded'] = le.fit_transform(df['blood_group'])
    
    # Save the encoder for later use
    joblib.dump(le, 'blood_group_encoder.joblib')

    # Target 1: Availability (Classification)
    # Available if healthy, >90 days since last donation, good reputation
    availability_prob = (
        (df['feeling_healthy'] * 0.5) +
        ((df['days_since_last_donation'] > 90).astype(int) * 0.3) +
        ((df['reputation_score'] > 80).astype(int) * 0.2)
    )
    df['is_available'] = (availability_prob > 0.6).astype(int)

    # Introduce some noise
    noise = np.random.choice([0, 1], n_samples, p=[0.9, 0.1])
    df['is_available'] = np.abs(df['is_available'] - noise)

    # Target 2: Days until next donation (Regression)
    # If already available, days is 0. Else, usually 90 - days_since_last_donation + random
    expected_days = 90 - df['days_since_last_donation']
    expected_days = np.where(expected_days < 0, 0, expected_days)
    # Add random delay based on reputation and donations
    delay = np.random.randint(0, 30, n_samples) - (df['total_donations'] * 2) + (100 - df['reputation_score']) // 5
    df['days_until_next_donation'] = expected_days + delay
    df['days_until_next_donation'] = np.where(df['days_until_next_donation'] < 0, 0, df['days_until_next_donation'])

    return df

def train_and_save_models():
    print("Generating synthetic data...")
    df = generate_synthetic_data(2000)

    # Features
    X = df[['age', 'blood_group_encoded', 'total_donations', 'days_since_last_donation', 'feeling_healthy', 'reputation_score']]

    # Target 1: Classification
    y_class = df['is_available']
    X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X, y_class, test_size=0.2, random_state=42)

    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train_c, y_train_c)
    print(f"Classification Model Accuracy: {clf.score(X_test_c, y_test_c):.2f}")
    joblib.dump(clf, 'availability_model.joblib')
    print("Saved availability_model.joblib")

    # Target 2: Regression
    y_reg = df['days_until_next_donation']
    X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(X, y_reg, test_size=0.2, random_state=42)

    reg = LinearRegression()
    reg.fit(X_train_r, y_train_r)
    print(f"Regression Model R^2 Score: {reg.score(X_test_r, y_test_r):.2f}")
    joblib.dump(reg, 'next_donation_model.joblib')
    print("Saved next_donation_model.joblib")

if __name__ == "__main__":
    train_and_save_models()
