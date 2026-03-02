# 🚀 Chatbot Integration Guide for React Frontend

## Step 1: Add ChatBot Component to App

Open [`frontend/src/App.jsx`](../frontend/src/App.jsx):

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import Profile from './pages/Profile';
import AnatomyViewer from './pages/AnatomyViewer';
import PrivateRoute from './components/PrivateRoute';

// 👇 Add this import
import ChatBot from './components/ChatBot';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/doctor" element={<PrivateRoute><DoctorDashboard /></PrivateRoute>} />
          <Route path="/patient" element={<PrivateRoute><PatientDashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/anatomy" element={<PrivateRoute><AnatomyViewer /></PrivateRoute>} />
        </Routes>

        {/* 👇 Add ChatBot component here - it appears as a floating button */}
        <ChatBot />
      </div>
    </Router>
  );
}

export default App;
```

That's it! The chatbot will appear as a floating button on all pages.

## Step 2: Start All Services

### Terminal 1 - Backend
```powershell
.\START-BACKEND.ps1
```
**URL:** http://localhost:8080

### Terminal 2 - Chatbot
```powershell
.\START-CHATBOT.ps1
```
**URL:** http://localhost:8087

### Terminal 3 - Frontend
```powershell
.\START-FRONTEND.ps1
```
**URL:** http://localhost:3000

## Step 3: Test the Chatbot

1. Open http://localhost:3000
2. Login to your account
3. Click the **💬 floating button** in the bottom-right
4. Try these queries:
   - "Show me all pending user approvals"
   - "List all patients"
   - "What can you help me with?"

## 🎨 Customization Options

### Change Button Position

Edit [`frontend/src/components/ChatBot.css`](../frontend/src/components/ChatBot.css):

```css
.floating-chat-button {
  position: fixed;
  bottom: 30px;  /* Change this */
  right: 30px;   /* Change this */
  left: auto;    /* Or use left: 30px for left side */
}
```

### Change Colors/Theme

```css
/* Gradient background */
.floating-chat-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Change to your brand colors */
}
```

### Hide on Specific Pages

```jsx
// In App.jsx - only show on dashboard pages
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const showChatbot = !['/login', '/register'].includes(location.pathname);

  return (
    <Router>
      <div className="App">
        <Routes>...</Routes>
        
        {showChatbot && <ChatBot />}
      </div>
    </Router>
  );
}
```

### Role-Based Features

To pass user role to chatbot, modify [`ChatBot.jsx`](../frontend/src/components/ChatBot.jsx):

```jsx
import { useAuthStore } from '../store/authStore';

const ChatBot = () => {
  const { user } = useAuthStore();
  
  const sendMessage = async (e) => {
    e.preventDefault();
    // ... existing code ...
    
    const response = await fetch(`${CHATBOT_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [...],
        user_role: user?.role, // 👈 Add role context
        user_id: user?.id
      })
    });
  };
};
```

## 🔧 CORS Configuration

If you get CORS errors, update backend CORS config.

Edit [`backend/src/main/java/com/healthatlas/config/CorsConfig.java`](../backend/src/main/java/com/healthatlas/config/CorsConfig.java):

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8087"  // 👈 Add chatbot origin
    ));
    // ... rest of config
}
```

## 🐛 Troubleshooting

### Chatbot not connecting

**Check:**
1. Is chatbot server running? `http://localhost:8087`
2. Console errors in browser DevTools?
3. Check `.env` file has correct API URL

**Fix:**
```bash
# Check if chatbot is running
curl http://localhost:8087

# If not, start it
.\START-CHATBOT.ps1
```

### "Connection refused" error

**Cause:** Chatbot server not running or wrong port

**Fix:**
```javascript
// In ChatBot.jsx, verify URL
const CHATBOT_API_URL = 'http://localhost:8087';
```

### Chatbot responds but no data

**Cause:** Backend API not accessible

**Fix:**
```bash
# Verify backend is running
curl http://localhost:8080/api/admin/patients

# Check chatbot .env
HEALTHATLAS_API_URL=http://localhost:8080/api
```

## 📱 Mobile Responsive

The chatbot is already mobile-friendly! On small screens it takes full screen.

## 🎉 You're Done!

The chatbot is now integrated and ready to use!

**Next steps:**
- Get a GitHub token: https://github.com/settings/tokens
- Add it to `medical-chatbot/.env`
- Customize the UI colors to match your brand
- Add more MCP tools for specific features

---

**Need help?** Check the [main README](../medical-chatbot/README.md)
