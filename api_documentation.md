# AgriSmart Platform - Backend API Specifications

This document outlines the API endpoints, payload configurations, and access security levels of the Smart Crop & Agriculture Intelligence platform.

## Authentication Endpoints

### 1. User Sign Up
* **Route**: `POST /api/auth/signup`
* **Access**: Public
* **Payload**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePassword123"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "token": "JWT_TOKEN_STRING"
  }
  ```

### 2. User Log In
* **Route**: `POST /api/auth/login`
* **Access**: Public
* **Payload**:
  ```json
  {
    "email": "jane@example.com",
    "password": "SecurePassword123"
  }
  ```

---

## Farm Management Endpoints

### 1. Fetch All Farms
* **Route**: `GET /api/farms`
* **Access**: Private (Authenticated user)
* **Headers**: `Authorization: Bearer <TOKEN>`

### 2. Register Farm Node
* **Route**: `POST /api/farms`
* **Access**: Private
* **Payload**:
  ```json
  {
    "name": "Oakridge Field",
    "size": 12.5,
    "soil": {
      "type": "clay",
      "nitrogen": 45,
      "phosphorus": 30,
      "potassium": 120,
      "pH": 6.8
    },
    "locationName": "Napa Valley, CA",
    "latitude": 38.2975,
    "longitude": -122.2869
  }
  ```

---

## AI & Diagnostics Endpoints

### 1. Smart Chatbot Advisor
* **Route**: `POST /api/ai/chat`
* **Access**: Private
* **Payload**:
  ```json
  {
    "message": "What is the NPK requirement for growing tomatoes?"
  }
  ```

### 2. Crop Canopy Blight Spotter
* **Route**: `POST /api/ai/disease-detect`
* **Access**: Private
* **Payload**: Multipart Form-Data
  * `image`: File
  * `cropType`: Tomato
* **Response**:
  ```json
  {
    "success": true,
    "data": {
      "diseaseDetected": "Early Blight (Alternaria solani)",
      "confidence": "94%",
      "leafCoverage": "15% infected",
      "remedies": {
        "organic": "Apply copper fungicides pre-harvest and discard diseased debris.",
        "chemical": "Chlorothalonil spray treatments according to label schedule."
      }
    }
  }
  ```

---

## Market Planning Endpoints

### 1. Get Live Crop Prices
* **Route**: `GET /api/market/prices`
* **Access**: Private

### 2. Profit Calculator
* **Route**: `POST /api/market/calculate-profit`
* **Access**: Private
* **Payload**:
  ```json
  {
    "cropType": "Tomato",
    "size": 5,
    "seedCost": 4000,
    "fertilizerCost": 6000,
    "laborCost": 10000,
    "waterCost": 3000
  }
  ```

---

## Community Forum Endpoints

### 1. Fetch Discussion Board
* **Route**: `GET /api/posts`
* **Access**: Private

### 2. Submit Question
* **Route**: `POST /api/posts`
* **Access**: Private
* **Payload**: Multipart Form-Data
  * `title`: String
  * `content`: String
  * `image`: File (Optional attachment)

### 3. Add Verified Expert Answer
* **Route**: `POST /api/posts/:id/expert-answer`
* **Access**: Private (Expert or Admin only)
* **Payload**:
  ```json
  {
    "answer": "This looks like Septoria leaf spot. Use organic mulch to prevent splash infection."
  }
  ```

---

## Administrative Console Endpoints

### 1. Modify User Roles
* **Route**: `PUT /api/admin/users/:id/role`
* **Access**: Private (Admin role only)
* **Payload**:
  ```json
  {
    "role": "expert"
  }
  ```

### 2. Delete User Account
* **Route**: `DELETE /api/admin/users/:id`
* **Access**: Private (Admin role only)
