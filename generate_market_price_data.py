import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

# Create comprehensive market price prediction dataset
print("Creating Market Price Prediction Dataset...")

# Crop and State mappings
CROPS = {
    1: 'Rice', 2: 'Wheat', 3: 'Maize', 4: 'Cotton',
    5: 'Sugarcane', 6: 'Pulses', 7: 'Vegetables', 8: 'Fruits'
}

STATES = {
    1: 'Andhra Pradesh', 2: 'Karnataka', 3: 'Kerala', 4: 'Tamil Nadu',
    5: 'Maharashtra', 6: 'Gujarat', 7: 'Rajasthan', 8: 'Madhya Pradesh',
    9: 'Uttar Pradesh', 10: 'Bihar', 11: 'West Bengal', 12: 'Punjab', 13: 'Haryana'
}

# Base prices for each crop (in Rupees per quintal)
BASE_PRICES = {
    1: 2500,   # Rice
    2: 2800,   # Wheat
    3: 1800,   # Maize
    4: 4500,   # Cotton
    5: 3200,   # Sugarcane
    6: 3500,   # Pulses
    7: 2000,   # Vegetables
    8: 3800    # Fruits
}

# State price modifiers (some states have higher/lower prices)
STATE_MODIFIERS = {
    1: 1.05, 2: 1.0, 3: 1.1, 4: 1.05, 5: 1.0, 6: 0.95,
    7: 0.9, 8: 0.95, 9: 1.0, 10: 0.95, 11: 1.0, 12: 1.05, 13: 1.05
}

# Seasonal price factors for each crop
SEASONAL_FACTORS = {
    1: {  # Rice - harvest in Oct-Dec
        1: 1.15, 2: 1.15, 3: 1.1, 4: 1.1, 5: 1.05, 6: 1.0,
        7: 0.95, 8: 0.95, 9: 0.95, 10: 0.9, 11: 0.9, 12: 1.0
    },
    2: {  # Wheat - harvest in Mar-Apr
        1: 1.1, 2: 1.05, 3: 0.9, 4: 0.85, 5: 0.95, 6: 1.0,
        7: 1.05, 8: 1.1, 9: 1.15, 10: 1.15, 11: 1.1, 12: 1.1
    },
    3: {  # Maize - harvest in Oct-Nov
        1: 1.15, 2: 1.15, 3: 1.1, 4: 1.05, 5: 1.0, 6: 0.95,
        7: 0.95, 8: 0.95, 9: 0.95, 10: 0.9, 11: 0.85, 12: 1.05
    },
    4: {  # Cotton - harvest in Oct-Jan
        1: 0.95, 2: 1.0, 3: 1.05, 4: 1.1, 5: 1.15, 6: 1.15,
        7: 1.1, 8: 1.05, 9: 1.0, 10: 0.9, 11: 0.85, 12: 0.9
    },
    5: {  # Sugarcane - harvest in Nov-Apr
        1: 0.95, 2: 0.95, 3: 0.9, 4: 0.9, 5: 1.0, 6: 1.05,
        7: 1.1, 8: 1.15, 9: 1.15, 10: 1.1, 11: 0.95, 12: 0.95
    },
    6: {  # Pulses - multiple seasons
        1: 1.05, 2: 1.0, 3: 1.0, 4: 0.95, 5: 0.95, 6: 1.0,
        7: 1.05, 8: 1.1, 9: 1.1, 10: 1.05, 11: 1.0, 12: 1.05
    },
    7: {  # Vegetables - year-round but monsoon affected
        1: 1.0, 2: 1.0, 3: 1.05, 4: 1.1, 5: 1.15, 6: 1.2,
        7: 1.25, 8: 1.2, 9: 1.1, 10: 1.0, 11: 0.95, 12: 0.95
    },
    8: {  # Fruits - seasonal variations
        1: 1.0, 2: 1.0, 3: 0.95, 4: 0.9, 5: 0.9, 6: 1.0,
        7: 1.05, 8: 1.1, 9: 1.15, 10: 1.15, 11: 1.05, 12: 1.0
    }
}

# Generate dataset
data = []
years = [2020, 2021, 2022, 2023, 2024]

np.random.seed(42)

for year in years:
    for crop_id in CROPS.keys():
        for state_id in STATES.keys():
            for month in range(1, 13):
                # Generate multiple price points per combination
                for _ in range(3):  # 3 samples per combination
                    
                    # Base price calculation
                    base_price = BASE_PRICES[crop_id]
                    state_mod = STATE_MODIFIERS[state_id]
                    seasonal_mod = SEASONAL_FACTORS[crop_id][month]
                    
                    # Environmental factors
                    # Rainfall affects prices (more rain = lower prices generally)
                    if month in [6, 7, 8, 9]:  # Monsoon months
                        rainfall = np.random.uniform(150, 400)
                        rainfall_factor = 1.0 - (rainfall - 200) / 2000  # More rain = lower price
                    elif month in [3, 4, 5]:  # Summer
                        rainfall = np.random.uniform(10, 100)
                        rainfall_factor = 1.0 + (100 - rainfall) / 500  # Less rain = higher price
                    else:  # Winter
                        rainfall = np.random.uniform(20, 150)
                        rainfall_factor = 1.0 + (100 - rainfall) / 800
                    
                    # Temperature affects prices
                    if month in [3, 4, 5, 6]:  # Hot months
                        temperature = np.random.uniform(28, 42)
                        temp_factor = 1.0 + (temperature - 30) / 100
                    elif month in [12, 1, 2]:  # Cold months
                        temperature = np.random.uniform(10, 25)
                        temp_factor = 1.0 + (20 - temperature) / 100
                    else:  # Moderate
                        temperature = np.random.uniform(20, 32)
                        temp_factor = 1.0
                    
                    # Calculate final price
                    price = base_price * state_mod * seasonal_mod * rainfall_factor * temp_factor
                    
                    # Add some random market fluctuation (±10%)
                    market_fluctuation = np.random.uniform(0.9, 1.1)
                    price = price * market_fluctuation
                    
                    # Add demand factor (randomly high/medium/low demand)
                    demand = np.random.choice(['Low', 'Medium', 'High'], p=[0.2, 0.6, 0.2])
                    if demand == 'High':
                        price *= 1.1
                    elif demand == 'Low':
                        price *= 0.9
                    
                    # Round to 2 decimal places
                    price = round(price, 2)
                    
                    # Create record
                    record = {
                        'Year': year,
                        'Month': month,
                        'Crop_ID': crop_id,
                        'Crop_Name': CROPS[crop_id],
                        'State_ID': state_id,
                        'State_Name': STATES[state_id],
                        'Rainfall': round(rainfall, 2),
                        'Temperature': round(temperature, 2),
                        'Demand': demand,
                        'Price_Per_Quintal': price
                    }
                    
                    data.append(record)

# Create DataFrame
df_price = pd.DataFrame(data)

# Add additional features
df_price['Season'] = df_price['Month'].apply(
    lambda x: 'Monsoon' if x in [6, 7, 8, 9] else 
              ('Summer' if x in [3, 4, 5] else 
               ('Winter' if x in [12, 1, 2] else 'Spring'))
)

# Add price category
df_price['Price_Category'] = pd.cut(df_price['Price_Per_Quintal'], 
                                     bins=[0, 2000, 3000, 4000, 10000],
                                     labels=['Low', 'Medium', 'High', 'Very_High'])

# Add month name
month_names = {1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June',
               7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'}
df_price['Month_Name'] = df_price['Month'].map(month_names)

# Add previous month price (lagged feature)
df_price = df_price.sort_values(['Crop_ID', 'State_ID', 'Year', 'Month']).reset_index(drop=True)
df_price['Previous_Month_Price'] = df_price.groupby(['Crop_ID', 'State_ID'])['Price_Per_Quintal'].shift(1)

# Fill NaN in Previous_Month_Price with current price (for first entry)
df_price['Previous_Month_Price'].fillna(df_price['Price_Per_Quintal'], inplace=True)

# Add price change
df_price['Price_Change'] = df_price['Price_Per_Quintal'] - df_price['Previous_Month_Price']
df_price['Price_Change_Percent'] = (df_price['Price_Change'] / df_price['Previous_Month_Price'] * 100).round(2)

# Shuffle the dataset
df_price = df_price.sample(frac=1, random_state=42).reset_index(drop=True)

# Save to CSV
output_path = os.path.join(os.path.dirname(__file__), 'market_price_data.csv')
df_price.to_csv(output_path, index=False)

print(f"✅ Created market_price_data.csv with {len(df_price)} records")
print(f"✅ Years covered: {sorted(df_price['Year'].unique())}")
print(f"✅ Number of crops: {len(CROPS)}")
print(f"✅ Number of states: {len(STATES)}")

print("\nPrice Statistics by Crop:")
print(df_price.groupby('Crop_Name')['Price_Per_Quintal'].agg(['min', 'mean', 'max']).round(2))

print("\nFirst few rows:")
print(df_price.head(10))

print("\nDataset Info:")
print(df_price.info())

print("\nColumn names:")
print(df_price.columns.tolist())

print("\nDataset saved successfully! ✅")
