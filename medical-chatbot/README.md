# 🏥 Health Atlas AI Chatbot

An intelligent medical assistant chatbot powered by Microsoft Agent Framework with Model Context Protocol (MCP) integration.

## 🌟 Features

### Role-Based Assistance
- **👨‍⚕️ For Doctors**: Patient lookup, medical records access, consent management
- **🔐 For Admins**: User approvals, system statistics, user management
- **👤 For Patients**: Platform navigation, medical term explanations, general help

### AI Capabilities
- Natural language understanding
- Context-aware conversations
- Real-time data access via MCP tools
- Integration with Health Atlas Java backend

### Technical Features
- ✅ Microsoft Agent Framework integration
- ✅ MCP (Model Context Protocol) for structured backend access
- ✅ GitHub Models support (free to start)
- ✅ VS Code debugging with Agent Inspector
- ✅ HTTP server mode for production
- ✅ React UI component included

## 🏗️ Architecture

```
┌─────────────────┐
│ React Frontend  │
│   Port 3000     │
└────────┬────────┘
         │
         ▼
┌────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Chatbot API   │◄────►│   MCP Server     │◄────►│   Spring Boot   │
│   Port 8087    │      │  (Tools Layer)   │      │    Port 8080    │
│  (Python)      │      │                  │      │    (Java)       │
└────────────────┘      └──────────────────┘      └─────────────────┘
```

## 📋 Prerequisites

- Python 3.10 or higher
- Node.js (for React frontend)
- Running Health Atlas backend (Spring Boot on port 8080)
- GitHub account (for GitHub Models API token)

## 🚀 Quick Start

### 1. Get GitHub Token (Free!)

Get your free GitHub Personal Access Token:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name like "Health Atlas Chatbot"
4. Select scopes: `repo`, `user`
5. Click "Generate token"
6. Copy the token (you'll need it next)

### 2. Setup Environment

```powershell
# Navigate to chatbot directory
cd "medical-chatbot"

# Copy and edit environment file
cp .env.example .env

# Edit .env and add your GitHub token
# GITHUB_TOKEN=your_github_token_here
```

### 3. Create Python Virtual Environment

```powershell
# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1

# Upgrade pip
python -m pip install --upgrade pip
```

### 4. Install Dependencies

```powershell
pip install -r requirements.txt
```

### 5. Start the Backend (if not running)

```powershell
# In a separate terminal, from Health Atlas root
cd ..
.\START-BACKEND.ps1
```

### 6. Run the Chatbot

**Option A: Simple Run**
```powershell
python chatbot.py
```

**Option B: Debug Mode (Recommended)**
1. Open VS Code
2. Press `F5` or click "Run and Debug"
3. Select "Debug Health Atlas Chatbot"
4. Agent Inspector will open automatically!

The chatbot will start on **http://localhost:8087**

## 🧪 Testing the Chatbot

### Using Agent Inspector (VS Code)

When you press F5, the Agent Inspector opens automatically. Try these queries:

```
1. "Show me all pending user approvals"
2. "List all patients in the system"
3. "Get details for patient ID 1"
4. "Show doctors specializing in cardiology"
5. "What medical records exist for patient 1?"
```

### Using API Directly

```powershell
# Test endpoint
curl -X POST http://localhost:8087/chat `
  -H "Content-Type: application/json" `
  -d '{"messages": [{"role": "user", "content": "Hello!"}]}'
```

## 🎨 Frontend Integration

Add the chatbot to your React app:

### 1. Import the Component

```jsx
// In App.jsx or any dashboard component
import ChatBot from './components/ChatBot';

function App() {
  return (
    <div className="App">
      {/* Your existing components */}
      
      {/* Add chatbot - it's a floating button! */}
      <ChatBot />
    </div>
  );
}
```

### 2. Update API Configuration

The chatbot component expects the chatbot server on `http://localhost:8087`. 
Make sure your chatbot server is running!

## 🔧 Configuration

### Environment Variables (.env)

```bash
# === AI Model Configuration ===
GITHUB_TOKEN=your_token_here           # Your GitHub Personal Access Token
CHAT_ENDPOINT=https://models.github.ai/inference
CHAT_MODEL=openai/gpt-4.1             # Or gpt-4o, o1, etc.

# === Backend API ===
HEALTHATLAS_API_URL=http://localhost:8080/api

# === Server ===
CHATBOT_PORT=8087
```

### Available Models

GitHub Models you can use (free tier):
- `openai/gpt-4.1` - Best balance (recommended)
- `openai/gpt-4o` - Fast and capable
- `openai/o1` - Advanced reasoning
- `meta/llama-3.3-70b-instruct` - Open source
- `microsoft/phi-4` - Small and efficient

Change model in `.env`:
```bash
CHAT_MODEL=openai/gpt-4o
```

## 🛠️ MCP Tools Available

The chatbot has access to these tools via MCP:

### Admin Tools
- `get_pending_approvals` - List users waiting for approval
- `approve_user` - Approve a pending user
- `get_all_patients` - List all patients
- `get_all_doctors` - List all doctors
- `toggle_user_status` - Activate/deactivate users

### Patient Tools
- `get_patient_details` - Get patient information
- `search_patients_by_organ` - Find patients by organ type
- `get_patient_medical_records` - Get patient's records
- `get_patient_consents` - Get consent records

### Doctor Tools
- `get_doctor_details` - Get doctor information
- `get_doctor_records` - Get doctor's medical records
- `get_doctor_consents` - Get doctor's consents

### Records & Consent
- `get_records_by_organ` - Search records by organ
- `get_system_info` - Platform information

## 🐛 Debugging

### VS Code Debug Mode

1. Press `F5` to start debugging
2. Agent Inspector opens automatically
3. Set breakpoints in `chatbot.py` or `mcp_server.py`
4. Chat in the Inspector - code pauses at breakpoints!

### Common Issues

**Import errors**: Make sure virtual environment is activated
```powershell
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Port 8087 already in use**:
```powershell
# Find and kill the process
Get-Process | Where-Object {$_.ProcessName -eq "python"} | Stop-Process
```

**Backend connection error**: Make sure Spring Boot is running on port 8080

**MCP tools not working**: Check `HEALTHATLAS_API_URL` in `.env`

## 📝 Development

### Adding New MCP Tools

Edit `mcp_server.py`:

```python
# 1. Add tool definition in handle_list_tools()
Tool(
    name="your_new_tool",
    description="What it does",
    inputSchema={
        "type": "object",
        "properties": {
            "param_name": {"type": "string", "description": "..."}
        }
    }
)

# 2. Add tool handler in handle_call_tool()
elif name == "your_new_tool":
    param = arguments.get("param_name")
    response = await http_client.get(f"{API_BASE_URL}/your-endpoint/{param}")
    ...
```

The chatbot AI will automatically discover and use new tools!

### Customizing System Prompt

Edit `chatbot.py`, modify `SYSTEM_PROMPT` to change the chatbot's behavior and personality.

## 🚀 Production Deployment

### Option 1: Docker (Recommended)

```dockerfile
# Dockerfile (create this)
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "chatbot.py"]
```

```powershell
docker build -t healthatlas-chatbot .
docker run -p 8087:8087 --env-file .env healthatlas-chatbot
```

### Option 2: Azure/Cloud Deployment

The chatbot is production-ready! Deploy as:
- Azure Container Instances
- Azure App Service
- AWS ECS
- Google Cloud Run

Just ensure environment variables are set!

## 📊 Monitoring & Tracing

Add Azure Application Insights or similar:

```python
# Future: Add to chatbot.py
from opencensus.ext.azure import AzureLogHandler
import logging

logger = logging.getLogger(__name__)
logger.addHandler(AzureLogHandler(
    connection_string='your-app-insights-connection'
))
```

## 🔒 Security

**Important for production:**

1. **Add authentication** to chatbot API
2. **Validate user roles** before tool execution
3. **Use HTTPS** in production
4. **Rotate API keys** regularly
5. **Add rate limiting**
6. **Sanitize user inputs**

Example: Add JWT validation:
```python
# Add to chatbot.py
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def verify_token(credentials = Depends(security)):
    # Validate JWT token from Health Atlas backend
    pass
```

## 📚 Learn More

- [Microsoft Agent Framework](https://github.com/microsoft/agent-framework)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [GitHub Models](https://github.com/marketplace/models)
- [Azure AI Documentation](https://learn.microsoft.com/azure/ai-services/)

## 🆘 Support

Issues? Questions?

1. Check the [troubleshooting section](#debugging)
2. Review chatbot logs in terminal
3. Use VS Code debugger with breakpoints
4. Check Health Atlas backend is running

## 📄 License

Part of the Health Atlas project.

---

**Made with ❤️ using Microsoft Agent Framework and MCP**
