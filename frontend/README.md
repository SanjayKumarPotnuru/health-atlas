# Health Atlas - Frontend

Interactive 3D Medical History Viewer built with React and Three.js.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

The frontend will run on **http://localhost:3000**

Make sure your backend is running on **http://localhost:8080**

## 📦 Features

### 🧑‍⚕️ Patient Portal
- View medical records with 3D anatomy visualization
- Manage consent requests (approve/deny)
- Browse medical history by organ system

### 👨‍⚕️ Doctor Portal
- Request patient consent (one-time, 7 days, 30 days, always)
- Add medical records for approved patients
- View patient records with 3D anatomy

### 🧍 3D Anatomy Viewer
- Interactive 3D human body model
- Click organs to view medical records
- Color-coded organ systems
- Smooth rotation and zoom controls

## 🛠️ Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **React Three Fiber** - Three.js integration
- **React Router** - Navigation
- **Zustand** - State management
- **Axios** - HTTP client

## 📂 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── axios.js          # API client with JWT interceptor
│   ├── components/
│   │   ├── HumanBody.jsx     # 3D human body model
│   │   └── PrivateRoute.jsx  # Protected route wrapper
│   ├── pages/
│   │   ├── Login.jsx         # Login page
│   │   ├── Register.jsx      # Registration page
│   │   ├── PatientDashboard.jsx
│   │   ├── DoctorDashboard.jsx
│   │   └── AnatomyViewer.jsx # 3D anatomy viewer
│   ├── store/
│   │   └── authStore.js      # Authentication state
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## 🔐 Authentication

JWT tokens are stored in localStorage and automatically attached to API requests.

## 🎨 3D Organs

The 3D viewer displays all 14 organ systems:
- Brain, Heart, Lungs, Liver, Stomach, Kidneys
- Intestines, Pancreas, Bladder, Spleen
- Thyroid, Adrenal Glands, Reproductive Organs, Skin

## 🌐 API Integration

All API calls proxy to `http://localhost:8080/api` via Vite dev server.

## 📱 Responsive Design

Optimized for desktop and tablet screens.

## 🧪 Testing the App

1. Start backend: `cd backend && mvn spring-boot:run`
2. Start frontend: `cd frontend && npm run dev`
3. Register as patient at http://localhost:3000/register
4. Register as doctor in new incognito window
5. Doctor requests consent with patient email
6. Patient approves consent
7. Doctor adds medical records
8. Patient views records in 3D anatomy viewer

## 🚀 Build for Production

```bash
npm run build
npm run preview
```

## 📄 License

Academic project for educational purposes.
