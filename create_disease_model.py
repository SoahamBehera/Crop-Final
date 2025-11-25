"""
Create a simple disease detection model for testing purposes
This creates a basic CNN model trained on mock data
"""

import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import os

print("🔨 Creating Disease Detection Model...")

# Ensure models directory exists
os.makedirs('models', exist_ok=True)

# Disease classes
DISEASE_CLASSES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy',
    'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy', 'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
    'Rice___Brown_Spot', 'Rice___Leaf_Blast', 'Rice___Neck_Blast', 'Rice___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy',
    'Wheat___Brown_rust', 'Wheat___Healthy', 'Wheat___Yellow_rust'
]

# Create a simple CNN model
model = keras.Sequential([
    layers.Input(shape=(224, 224, 3)),
    
    # First block
    layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
    layers.BatchNormalization(),
    layers.MaxPooling2D((2, 2)),
    layers.Dropout(0.25),
    
    # Second block
    layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
    layers.BatchNormalization(),
    layers.MaxPooling2D((2, 2)),
    layers.Dropout(0.25),
    
    # Third block
    layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
    layers.BatchNormalization(),
    layers.MaxPooling2D((2, 2)),
    layers.Dropout(0.25),
    
    # Flatten and Dense layers
    layers.Flatten(),
    layers.Dense(256, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(len(DISEASE_CLASSES), activation='softmax')
])

# Compile the model
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

print(f"✅ Model created with {len(DISEASE_CLASSES)} classes")
print("\nModel Architecture:")
model.summary()

# Train on dummy data to initialize weights
print("\n🔄 Training model on dummy data for initialization...")
X_train = np.random.randn(100, 224, 224, 3).astype('float32') / 255.0
y_train = keras.utils.to_categorical(np.random.randint(0, len(DISEASE_CLASSES), 100), len(DISEASE_CLASSES))

model.fit(
    X_train, y_train,
    epochs=2,
    batch_size=10,
    verbose=1,
    validation_split=0.2
)

# Save the model
model_path = 'models/plant_disease_model.h5'
model.save(model_path)
print(f"\n✅ Disease detection model saved to: {model_path}")

# Also save class names for reference
import json
class_info = {
    'num_classes': len(DISEASE_CLASSES),
    'classes': DISEASE_CLASSES
}
with open('models/disease_classes.json', 'w') as f:
    json.dump(class_info, f, indent=2)

print("✅ Disease classes info saved to: models/disease_classes.json")
