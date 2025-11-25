import pandas as pd
import numpy as np
import os

# Create comprehensive crop disease dataset
print("Creating Crop Disease Detection Dataset...")

# Disease categories with their characteristics
diseases_data = []

# Rice diseases
rice_diseases = [
    # Disease_Name, Crop, Severity, Leaf_Color, Spot_Size, Spot_Pattern, Temperature, Humidity, Affected_Area_Percent
    ['Brown_Spot', 'Rice', 'Medium', 'Brown', 'Small', 'Circular', 28, 85, 25],
    ['Brown_Spot', 'Rice', 'Medium', 'Brown', 'Small', 'Circular', 29, 88, 30],
    ['Brown_Spot', 'Rice', 'High', 'Dark_Brown', 'Medium', 'Circular', 30, 90, 45],
    ['Leaf_Blast', 'Rice', 'High', 'Gray', 'Large', 'Diamond', 26, 92, 50],
    ['Leaf_Blast', 'Rice', 'High', 'White_Gray', 'Large', 'Diamond', 25, 95, 55],
    ['Leaf_Blast', 'Rice', 'Medium', 'Gray', 'Medium', 'Diamond', 27, 88, 35],
    ['Neck_Blast', 'Rice', 'Severe', 'Black', 'Large', 'Irregular', 24, 90, 60],
    ['Neck_Blast', 'Rice', 'Severe', 'Dark_Gray', 'Large', 'Irregular', 25, 93, 65],
    ['Healthy', 'Rice', 'None', 'Green', 'None', 'None', 28, 75, 0],
    ['Healthy', 'Rice', 'None', 'Dark_Green', 'None', 'None', 27, 70, 0],
]

# Wheat diseases
wheat_diseases = [
    ['Brown_Rust', 'Wheat', 'High', 'Brown_Orange', 'Small', 'Pustules', 20, 70, 40],
    ['Brown_Rust', 'Wheat', 'High', 'Orange', 'Small', 'Pustules', 22, 75, 45],
    ['Brown_Rust', 'Wheat', 'Medium', 'Light_Brown', 'Small', 'Pustules', 18, 68, 30],
    ['Yellow_Rust', 'Wheat', 'High', 'Yellow', 'Small', 'Stripes', 15, 80, 50],
    ['Yellow_Rust', 'Wheat', 'High', 'Bright_Yellow', 'Small', 'Stripes', 16, 85, 55],
    ['Yellow_Rust', 'Wheat', 'Medium', 'Yellow', 'Small', 'Stripes', 17, 78, 35],
    ['Healthy', 'Wheat', 'None', 'Green', 'None', 'None', 20, 60, 0],
    ['Healthy', 'Wheat', 'None', 'Green', 'None', 'None', 21, 65, 0],
]

# Tomato diseases
tomato_diseases = [
    ['Early_Blight', 'Tomato', 'Medium', 'Dark_Brown', 'Medium', 'Concentric', 26, 80, 35],
    ['Early_Blight', 'Tomato', 'High', 'Brown', 'Large', 'Concentric', 28, 85, 50],
    ['Early_Blight', 'Tomato', 'Medium', 'Brown', 'Medium', 'Concentric', 25, 78, 30],
    ['Late_Blight', 'Tomato', 'Severe', 'Gray_Black', 'Large', 'Irregular', 18, 95, 70],
    ['Late_Blight', 'Tomato', 'Severe', 'Black', 'Large', 'Irregular', 20, 92, 75],
    ['Late_Blight', 'Tomato', 'High', 'Dark_Gray', 'Large', 'Irregular', 19, 90, 60],
    ['Bacterial_Spot', 'Tomato', 'Medium', 'Brown_Yellow', 'Small', 'Circular', 28, 85, 25],
    ['Bacterial_Spot', 'Tomato', 'High', 'Dark_Brown', 'Small', 'Circular', 30, 88, 40],
    ['Leaf_Mold', 'Tomato', 'Medium', 'Yellow', 'Medium', 'Fuzzy', 24, 90, 30],
    ['Leaf_Mold', 'Tomato', 'High', 'Olive_Green', 'Medium', 'Fuzzy', 25, 95, 45],
    ['Septoria_Leaf_Spot', 'Tomato', 'Medium', 'Brown', 'Small', 'Circular', 26, 80, 35],
    ['Target_Spot', 'Tomato', 'Medium', 'Brown', 'Medium', 'Target', 27, 82, 30],
    ['Yellow_Leaf_Curl_Virus', 'Tomato', 'High', 'Yellow', 'None', 'Curled', 32, 70, 50],
    ['Mosaic_Virus', 'Tomato', 'Medium', 'Yellow_Green', 'None', 'Mosaic', 28, 75, 40],
    ['Healthy', 'Tomato', 'None', 'Green', 'None', 'None', 25, 70, 0],
    ['Healthy', 'Tomato', 'None', 'Dark_Green', 'None', 'None', 26, 68, 0],
]

# Potato diseases
potato_diseases = [
    ['Early_Blight', 'Potato', 'Medium', 'Brown', 'Medium', 'Concentric', 24, 80, 35],
    ['Early_Blight', 'Potato', 'High', 'Dark_Brown', 'Large', 'Concentric', 26, 85, 50],
    ['Late_Blight', 'Potato', 'Severe', 'Black', 'Large', 'Irregular', 18, 92, 70],
    ['Late_Blight', 'Potato', 'Severe', 'Gray_Black', 'Large', 'Irregular', 20, 95, 80],
    ['Late_Blight', 'Potato', 'High', 'Dark_Gray', 'Large', 'Irregular', 19, 90, 65],
    ['Healthy', 'Potato', 'None', 'Green', 'None', 'None', 22, 70, 0],
    ['Healthy', 'Potato', 'None', 'Dark_Green', 'None', 'None', 21, 72, 0],
]

# Corn/Maize diseases
corn_diseases = [
    ['Cercospora_Leaf_Spot', 'Corn', 'Medium', 'Gray', 'Small', 'Circular', 28, 85, 30],
    ['Cercospora_Leaf_Spot', 'Corn', 'High', 'Gray_Brown', 'Medium', 'Circular', 29, 88, 45],
    ['Common_Rust', 'Corn', 'Medium', 'Brown', 'Small', 'Pustules', 22, 75, 35],
    ['Common_Rust', 'Corn', 'High', 'Orange_Brown', 'Medium', 'Pustules', 24, 80, 50],
    ['Northern_Leaf_Blight', 'Corn', 'High', 'Gray_Green', 'Large', 'Elongated', 25, 90, 55],
    ['Northern_Leaf_Blight', 'Corn', 'Severe', 'Gray', 'Large', 'Elongated', 26, 92, 70],
    ['Healthy', 'Corn', 'None', 'Green', 'None', 'None', 26, 70, 0],
    ['Healthy', 'Corn', 'None', 'Dark_Green', 'None', 'None', 25, 68, 0],
]

# Apple diseases
apple_diseases = [
    ['Apple_Scab', 'Apple', 'High', 'Brown_Black', 'Medium', 'Irregular', 18, 85, 45],
    ['Apple_Scab', 'Apple', 'High', 'Dark_Brown', 'Large', 'Irregular', 20, 90, 55],
    ['Black_Rot', 'Apple', 'High', 'Brown', 'Large', 'Circular', 24, 80, 50],
    ['Black_Rot', 'Apple', 'Severe', 'Black', 'Large', 'Circular', 26, 85, 65],
    ['Cedar_Apple_Rust', 'Apple', 'Medium', 'Orange_Yellow', 'Small', 'Circular', 22, 75, 30],
    ['Cedar_Apple_Rust', 'Apple', 'Medium', 'Orange', 'Medium', 'Circular', 23, 78, 35],
    ['Healthy', 'Apple', 'None', 'Green', 'None', 'None', 20, 65, 0],
    ['Healthy', 'Apple', 'None', 'Dark_Green', 'None', 'None', 21, 68, 0],
]

# Grape diseases
grape_diseases = [
    ['Black_Rot', 'Grape', 'High', 'Brown', 'Medium', 'Circular', 26, 85, 45],
    ['Black_Rot', 'Grape', 'Severe', 'Black', 'Large', 'Circular', 28, 88, 60],
    ['Esca_Black_Measles', 'Grape', 'High', 'Yellow_Brown', 'Large', 'Irregular', 30, 75, 50],
    ['Esca_Black_Measles', 'Grape', 'Severe', 'Brown_Black', 'Large', 'Irregular', 32, 78, 65],
    ['Leaf_Blight', 'Grape', 'Medium', 'Brown', 'Medium', 'Irregular', 25, 80, 35],
    ['Leaf_Blight', 'Grape', 'High', 'Dark_Brown', 'Large', 'Irregular', 27, 85, 50],
    ['Healthy', 'Grape', 'None', 'Green', 'None', 'None', 26, 70, 0],
    ['Healthy', 'Grape', 'None', 'Dark_Green', 'None', 'None', 25, 68, 0],
]

# Combine all diseases
all_diseases = (rice_diseases + wheat_diseases + tomato_diseases + 
                potato_diseases + corn_diseases + apple_diseases + grape_diseases)

# Generate more samples through variations
expanded_data = []
for disease_entry in all_diseases:
    # Add original entry
    expanded_data.append(disease_entry)
    
    # Create 5-10 variations with slight changes
    num_variations = np.random.randint(5, 11)
    for _ in range(num_variations):
        variation = disease_entry.copy()
        # Add random variations to temperature and humidity
        if variation[0] != 'Healthy':
            variation[6] = variation[6] + np.random.uniform(-2, 2)  # Temperature
            variation[7] = variation[7] + np.random.uniform(-5, 5)  # Humidity
            variation[8] = variation[8] + np.random.uniform(-5, 5)  # Affected area
            variation[8] = max(0, min(100, variation[8]))  # Keep in 0-100 range
        expanded_data.append(variation)

# Create DataFrame
columns = ['Disease_Name', 'Crop', 'Severity', 'Leaf_Color', 'Spot_Size', 
           'Spot_Pattern', 'Temperature', 'Humidity', 'Affected_Area_Percent']
df_disease = pd.DataFrame(expanded_data, columns=columns)

# Add Disease_ID (encoding for model training)
disease_mapping = {disease: idx for idx, disease in enumerate(df_disease['Disease_Name'].unique())}
df_disease['Disease_ID'] = df_disease['Disease_Name'].map(disease_mapping)

# Add some additional useful features
df_disease['Season'] = df_disease['Temperature'].apply(
    lambda x: 'Summer' if x > 28 else ('Winter' if x < 20 else 'Monsoon')
)

# Shuffle the dataset
df_disease = df_disease.sample(frac=1, random_state=42).reset_index(drop=True)

# Save to CSV
output_path = os.path.join(os.path.dirname(__file__), 'crop_disease_data.csv')
df_disease.to_csv(output_path, index=False)

print(f"✅ Created crop_disease_data.csv with {len(df_disease)} records")
print(f"✅ Number of disease classes: {len(disease_mapping)}")
print(f"\nDisease Classes:")
for disease, id in sorted(disease_mapping.items(), key=lambda x: x[1]):
    count = len(df_disease[df_disease['Disease_Name'] == disease])
    print(f"  {id}: {disease} ({count} samples)")

print("\nFirst few rows:")
print(df_disease.head(10))

print("\nDataset Info:")
print(df_disease.info())

print("\nDataset saved successfully! ✅")
