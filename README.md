# 🚗 AI-Powered Vehicle Diagnostics & Mileage Integrity Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.9+-3776ab.svg)](https://www.python.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.72-61dafb.svg)](https://reactnative.dev/)
[![Blockchain](https://img.shields.io/badge/Blockchain-Hyperledger-2F3134.svg)](https://www.hyperledger.org/)

> Transforming the automotive ecosystem using AI, Machine Learning, NLP, and Blockchain to deliver transparent, intelligent, and fraud-resistant vehicle services.

**Group Number:** 25-26J-396  
**Project Date:** January 2026

---

## 👥 Project Team (Group 25-26J-396)

| Student ID     | Name           | Specialization         | Module Responsibility              |
|----------------|----------------|------------------------|------------------------------------|
| **IT21330278** | Adithya D      | Information Technology | AI Fault-Type Classifier           |
| **IT22273994** | Wijesinghe S.L | Information Technology | Repair Cost Estimator              |
| **IT22229434** | Denuwan P.M.K  | Information Technology | Repair Time Estimatin with Chatbot & Garage Recommendation System |
| **IT22552556** | Deshan P.H.P   | Information Technology | Mileage Integrity & Fraud Detection|


## 📌 Project Overview

This platform addresses major real-world automotive challenges such as:

- ❌ **Unpredictable vehicle breakdowns**
- 💸 **Large variations in repair costs** (up to 40%)
- 🚫 **Mileage fraud** affecting ~30% of used vehicles
- ⏳ **Inefficient diagnostics and garage selection**

By integrating **AI-driven diagnostics**, **repair cost & time estimation**, **garage recommendation**, and **blockchain-based mileage integrity**, the system builds a trusted automotive ecosystem for drivers, garages, insurers, and buyers.

### 📊 Key Statistics
| Challenge | Impact |
|-----------|--------|
| Mileage Fraud | 30% of used cars in EU affected |
| Repair Cost Variation | 40% variation across garages |
| AI Diagnostic Accuracy | 90%+ fault classification accuracy |
| Fraud Detection | >95% accuracy target |

---

## 🎯 Key Objectives

✅ Provide instant AI-based fault diagnosis  
✅ Predict repair cost ranges with uncertainty handling  
✅ Estimate repair time (ETA) accurately  
✅ Recommend the best garage using multi-factor ranking  
✅ Prevent vehicle mileage fraud using blockchain  
✅ Increase transparency, trust, and efficiency  

---

## 🧩 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Vehicle / User Input                        │
│            (Diagnostic Data, Audio, Repair History)             │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              AI & ML Models (ML, DL, NLP)                       │
│  • Fault Classifier  • Cost Estimator  • Garage Ranker         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│         Repair Estimation & Garage Ranking                      │
│  • ETA Prediction  • Multi-factor Scoring  • Route Planning    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│         Blockchain Ledger (Mileage Integrity)                   │
│  • Immutable Records  • Fraud Detection  • Validation          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│         Mobile / Web Application (REST APIs)                    │
│  • Driver Interface  • Garage Portal  • Admin Dashboard        │
└─────────────────────────────────────────────────────────────────┘
```

### Core Layers
1. **Data Collection** - Sensors, OBD-II, Audio, User Input
2. **AI & ML Models** - Classification, Prediction, NLP
3. **Blockchain Ledger** - Immutable vehicle history
4. **REST APIs** - Service integration layer
5. **User Interfaces** - Mobile app, web portal

---

## 🔍 Core Modules

### 1️⃣ AI Fault-Type Classifier
**Developer:** IT21330278 | Adithya D

#### Problem
- Traditional OBD-II scanners only show generic fault codes
- Requires manual interpretation by technicians
- Time-consuming diagnostic process

#### Solution
- AI-driven classification to identify root causes
- Supports tabular data + audio-based diagnostics
- Multi-model ensemble approach

#### Technologies
- **Random Forest** - Tabular fault pattern analysis
- **XGBoost** - Advanced gradient boosting
- **CNN** - Audio spectrogram analysis

#### Workflow
```
Record Sounds → Generate Spectrograms → ML Classification → Instant Diagnosis
```

1. Collect diagnostic data / engine sounds
2. Generate spectrograms (for audio)
3. ML/DL models classify fault type
4. Instant feedback to user

#### Benefits
✅ Immediate diagnosis  
✅ Reduced diagnostic time  
✅ **90%+ expected accuracy**  

---

### 2️⃣ Repair Cost Estimation System
**Developer:** IT22273994 | Wijesinghe S.L

#### Purpose
Predict transparent repair cost ranges instead of a single value using probabilistic modeling.

#### Models Used
- **Regression Models** - Traditional statistical approaches
- **TabNet** - Deep Learning for complex tabular data relationships

#### Inputs
- Historical repair invoices
- Spare part prices
- Labor rates
- Regional variations

#### Outputs - Probabilistic Cost Ranges

| Percentile | Meaning |
|------------|---------|
| **P10** | Minimum expected cost (lower bound) |
| **P50** | Median / most likely cost |
| **P90** | Maximum expected cost (upper bound) |

#### Benefits
✅ Helps drivers budget confidently  
✅ Reduces disputes and negotiations  
✅ Automates insurance claim estimates  
✅ Standardizes repair pricing  

---

### 3️⃣ AI-Based Garage Recommendation & Repair Time Estimation
**Developer:** IT22229434 | Denuwan P.M.K  
**Special Focus:** Sri Lanka's first AI-powered garage recommendation system
**Desgined On:**Suzuzki Alto Cars (2010-2025) with 7 fault categories
#### Features
- Predict repair ETA using ML
- Rank garages using weighted scoring
- Hybrid chatbot for fault capture & drivability check (This chatbot act as Rule Based + Gemini API with knowldege base)
- Integrated booking and tracking

#### Key Ranking Factors
🎯 **Fault severity** - Minor vs serious repairs  
👥 **Queue length** - vs available mechanics  
📍 **Distance** - to garage location  
⭐ **User ratings** - customer reviews  
⏱️ **Predicted repair time** - ML-based ETA  

#### Tech Stack
| Component | Technology |
|-----------|------------|
| Hybtrid Chatbot | Rule Based + Gemini API with Knowledge Base |
| ML Models | Scikit-learn (Regression) |
| Database | MySQL |
| Maps & Routing | OpenStreet with Leaflet |
| Mobile App | React Native |

#### Expected Accuracy
- **ETA prediction:** 70–80%
- **Garage ranking relevance:** ≥75%

---

### 4️⃣ Vehicle Mileage Integrity & Fraud Detection System
**Developer:** IT22552556 | Deshan P.H.P

#### Problem
Mileage tampering is common and difficult to verify, affecting 30% of used cars in the EU.

#### Solution
- **Blockchain-based** immutable vehicle history
- **Multimodal AI** fraud detection
- Cross-verification system

#### Technologies
- **Blockchain:** Hyperledger (permissioned) / Polygon (public)
- **AI Fraud Detector:** Tabular + Audio + Visual data processing

1. **Odometer reading validation** - Cross-reference with historical data
2. **Repair log analysis** - Verify consistency with service records
3. **Multimodal AI analysis** - Sound + visual inspection data
4. **Blockchain recording** - Immutable transaction ledger

#### Impact
✅ Prevents mileage fraud  
✅ Restores trust in used-car market  
✅ **95%+ fraud detection accuracy target**  
✅ Increases vehicle resale value  

---

## ⚙️ Technology Stack

| Layer | Technologies |
|-------|-------------|
| **ML / AI** | Scikit-learn, CNN, XGBoost, TabNet, TensorFlow/PyTorch |
| **NLP** | Rasa |
| **Backend** | Python, Node.js, REST APIs |
| **Database** | MySQL |
| **Blockchain** | Hyperledger / Polygon |
| **Frontend** | React Native (Mobile), React (Web) |
| **Cloud & Storage** | AWS S3 |
| **APIs** | Google Maps API |
| **Development** | Git, Docker, CI/CD |

---

## 📦 Installation

### Prerequisites
```bash
node >= 16.0.0
python >= 3.9
npm >= 8.0.0
docker >= 20.10 (optional)
```

### 1. Clone Repository
```bash
git clone https://github.com/your-org/vehicle-diagnostics-platform.git
cd vehicle-diagnostics-platform
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Mobile App Setup
```bash
cd mobile
npm install

# For Android
npx react-native run-android

# For iOS
npx react-native run-ios
```

### 5. Environment Configuration
Create `.env` file in root directory:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/vehicle_db

# AWS
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_S3_BUCKET=vehicle-diagnostics-data

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Blockchain
BLOCKCHAIN_NODE_URL=your_blockchain_node_url
HYPERLEDGER_API_KEY=your_hyperledger_key

# ML Models
MODEL_PATH=/path/to/trained/models
```

---

## 🚀 Usage Guide

### For Drivers 🚙
1. **Diagnose Vehicle Issues**
   - Record engine/brake sounds via smartphone
   - Receive instant AI-powered fault classification
   - Get maintenance recommendations

2. **Get Repair Cost Estimates**
   - View probabilistic cost ranges (P10, P50, P90)
   - Budget confidently for repairs
   - Compare estimates across garages

3. **Find Best Garage**
   - Chat with AI assistant about your issue
   - Get ranked garage recommendations
   - View estimated repair time
   - Book appointments directly

4. **Track Repair Progress**
   - Real-time updates on repair status
   - Direct communication with garage
   - Rate and review service

5. **Verify Vehicle History**
   - Check blockchain-verified mileage records
   - View complete service history
   - Detect potential fraud before purchase

### For Garages 🔧
1. **Quick Diagnostics** - Use AI classifier for faster fault identification
2. **Transparent Pricing** - Provide standardized cost estimates
3. **Manage Queue** - Optimize job scheduling with ETA predictions
4. **Build Trust** - Contribute to blockchain-verified service records
5. **Customer Management** - Track appointments and feedback

### For Insurance Companies 🏢
1. **Automate Claims** - Use AI cost estimates for faster processing
2. **Verify History** - Access blockchain vehicle records
3. **Fraud Detection** - Identify mileage tampering attempts
4. **Risk Assessment** - Analyze vehicle maintenance patterns

---

## 🧠 Ethical Considerations

🔒 **Data Privacy**
- No personal data tracking beyond essential diagnostics
- No user location misuse
- Secure encrypted storage

🔍 **Transparency**
- Clear AI decision explanations
- Open about model limitations
- User consent for all data usage

🛡️ **Security**
- Immutable blockchain records
- Multi-layer validation
- Regular security audits

⚖️ **Fairness**
- No discriminatory pricing
- Equal access to services
- Unbiased garage recommendations

---

## 💼 Commercialization Strategy

### Business Model
**SaaS API Platform** - Flexible subscription-based access to AI and blockchain services

### Revenue Streams

| Stream | Description | Target |
|--------|-------------|--------|
| **Subscription Plans** | Tiered monthly/annual plans | Garages, Insurers |
| **Licensing** | AI & blockchain module licensing | Enterprise clients |
| **Per-Transaction Fees** | Blockchain validation charges | All users |
| **Premium Features** | Advanced analytics, priority support | Power users |

### Target Market

🎯 **Primary Users**
- Garages and auto repair shops
- Insurance companies
- Vehicle buyers & sellers
- Fleet management companies

🎯 **Secondary Users**
- Government agencies (vehicle inspection)
- Car dealerships
- Independent mechanics

### Value Proposition
✅ **Fraud-proof vehicle history** - Blockchain verification  
✅ **Transparent ecosystem** - AI-driven trust  
✅ **Cost savings** - 40% reduction in price variation  
✅ **Time efficiency** - Instant diagnostics and ETA  
✅ **Enhanced trust** - Verified records for all stakeholders  


### Code Standards
- **Python:** Follow PEP 8 guidelines
- **JavaScript/React:** Use ESLint configuration
- **Commits:** Write clear, descriptive commit messages
- **Testing:** Include unit tests for new features
- **Documentation:** Update README and inline comments

### Areas for Contribution
- 🐛 Bug fixes and issue resolution
- ✨ New features and enhancements
- 📝 Documentation improvements
- 🧪 Test coverage expansion
- 🎨 UI/UX improvements
- 🌍 Internationalization (i18n)

---
## 🌟 Key Features Summary

| Feature              | Technology                  |  Impact               |
|----------------------|-----------------------------|-----------------------|
| Fault Classification | CNN, XGBoost, Random Forest | Instant diagnostics   |
| Cost Estimation      | TabNet, Regression          | Budget confidence     |
| Garage Ranking       | ML + NLP for Chatbot        |  Optimal selection    |
| Fraud Detection      | Blockchain + Multimodal AI  |  Prevents tampering   |



