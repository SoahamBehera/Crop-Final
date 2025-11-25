#!/usr/bin/env python3
"""
Setup script for CultivaSense project
This script initializes the project with required data and models
"""

import os
import sys
import subprocess
from pathlib import Path

def create_directories():
    """Create necessary directories"""
    dirs = ['uploads', 'models', 'data']
    for dir_name in dirs:
        Path(dir_name).mkdir(exist_ok=True)
        print(f"✅ Created directory: {dir_name}")

def install_dependencies():
    """Install required Python packages"""
    print("\n📦 Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        print("✅ Dependencies installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing dependencies: {e}")
        return False
    return True

def generate_data():
    """Generate required datasets"""
    print("\n📊 Generating datasets...")
    
    try:
        # Generate disease detection data
        if os.path.exists('generate_disease_data.py'):
            subprocess.check_call([sys.executable, 'generate_disease_data.py'])
            print("✅ Disease detection dataset generated")
    except Exception as e:
        print(f"⚠️ Could not generate disease data: {e}")
    
    try:
        # Generate market price data
        if os.path.exists('generate_market_price_data.py'):
            subprocess.check_call([sys.executable, 'generate_market_price_data.py'])
            print("✅ Market price dataset generated")
    except Exception as e:
        print(f"⚠️ Could not generate price data: {e}")

def verify_models():
    """Check if required model files exist"""
    print("\n🔍 Checking for model files...")
    
    models_to_check = [
        ('model.pkl', 'Crop Recommendation Model'),
        ('minmaxscaler.pkl', 'MinMax Scaler'),
        ('Crop_recommendation.csv', 'Crop Recommendation Data'),
    ]
    
    optional_models = [
        ('models/plant_disease_model.h5', 'Plant Disease Detection Model'),
        ('models/market_price_model.pkl', 'Market Price Prediction Model'),
    ]
    
    missing_required = []
    missing_optional = []
    
    for model_path, model_name in models_to_check:
        if os.path.exists(model_path):
            print(f"✅ Found: {model_name}")
        else:
            print(f"❌ Missing: {model_name}")
            missing_required.append(model_name)
    
    for model_path, model_name in optional_models:
        if os.path.exists(model_path):
            print(f"✅ Found: {model_name}")
        else:
            print(f"⚠️ Optional - Missing: {model_name} (mock predictions will be used)")
            missing_optional.append(model_name)
    
    return missing_required, missing_optional

def main():
    print("=" * 50)
    print("🌱 CultivaSense Setup Script")
    print("=" * 50)
    
    # Create directories
    create_directories()
    
    # Install dependencies
    if not install_dependencies():
        print("❌ Failed to install dependencies. Please install manually.")
        return False
    
    # Generate data
    generate_data()
    
    # Verify models
    missing_required, missing_optional = verify_models()
    
    print("\n" + "=" * 50)
    if missing_required:
        print("⚠️ Missing required models:")
        for model in missing_required:
            print(f"  - {model}")
        print("\nPlease train and save these models before running the application.")
    else:
        print("✅ All required models are present!")
    
    if missing_optional:
        print("\n⚠️ Missing optional models:")
        for model in missing_optional:
            print(f"  - {model}")
        print("\nThe application will use mock predictions for these features.")
    
    print("\n" + "=" * 50)
    print("✅ Setup complete! You can now run: python app.py")
    print("=" * 50)
    
    return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
