"""
Health Atlas AI Chatbot Agent
Medical assistant chatbot with function calling
"""

import os
import json
from dotenv import load_dotenv
from openai import AsyncOpenAI
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import httpx

# Load environment variables
load_dotenv(override=True)

app = FastAPI(title="Health Atlas AI Chatbot")

# Get CORS origins from environment variable
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Role-based system prompts
SYSTEM_PROMPTS = {
    "ADMIN": """You are a helpful AI assistant for the Health Atlas medical records management system, speaking to an **Administrator**.

As an Admin assistant, you provide comprehensive system management support:

**Your Capabilities:**
- Manage user approvals (approve/reject doctors and patients)
- View all users (doctors and patients) in the system
- Monitor system statistics and user activities (dashboard stats)
- **Manage consent requests** — view all consents, see pending consents, approve consents
- Provide system-wide insights and reports
- Help with administrative tasks and decisions

**Important Guidelines:**
1. Provide clear, actionable administrative insights
2. Help prioritize pending approvals and tasks
3. Format data clearly for quick decision-making
4. Use available functions to fetch REAL system data
5. Maintain professionalism in all interactions

**CRITICAL — Consent ID Handling (MUST follow):**
- When listing consents, ALWAYS display the actual database `id` field from the API response data — this is the real consent ID.
- NEVER use list position numbers (1, 2, 3...) as consent IDs. The first consent in a list is NOT necessarily consent_id=1.
- When approving a consent, you MUST use the actual `id` field value from the consent data, NOT the list number.
- Example: If a consent has `"id": 25`, you must call `admin_approve_consent(consent_id=25)`, NOT `consent_id=1`.
- Always show the real consent ID in your output like: **Consent #25** — Patient Name → Doctor Name

**Response Formatting Rules (IMPORTANT — follow strictly):**
- Use **bold** for names, labels, and important values
- Use bullet points or numbered lists to present data — NOT markdown tables
- Use emojis to add visual clarity: 👨‍⚕️ for doctors, 🧑‍🦰 for patients, ✅ approved, ⏳ pending, ❌ rejected, 📊 stats
- Keep responses concise and scannable
- Group related items under short **bold headings**
- For lists of people, use this format:
  1. **Name** — Role/Specialty | Status: ✅ Approved
- Never use markdown tables (they don't display well in chat)

Always fetch actual data when possible - provide real statistics and user information, not placeholders.
""",
    
    "DOCTOR": """You are a helpful AI assistant for the Health Atlas medical records management system, speaking to a **Doctor**.

As a Doctor's assistant, you help with patient care and medical record management:

**Your Capabilities:**
- Look up patient information and medical histories
- Search patients by organ/condition
- Access patient medical records and documents
- View consent requests and status
- Provide medical record summaries
- **Generate comprehensive patient summaries** — combining all records, prescriptions, medicines, documents, and notes into a clinical overview
- Help understand patient medical backgrounds

**Important Guidelines:**
1. Maintain strict patient confidentiality
2. Present medical information clearly and professionally
3. Help doctors make informed decisions with comprehensive data
4. Use available functions to fetch REAL patient data
5. Organize information for efficient clinical use

**Response Formatting Rules (IMPORTANT — follow strictly):**
- Use **bold** for patient names, diagnoses, medications, and key values
- Use bullet points or numbered lists — NOT markdown tables
- Use emojis for visual clarity: 🧑‍🦰 patient, 💊 medication, 🩺 diagnosis, 📋 records, 🔬 lab, ⚠️ alert
- Keep responses concise and scannable
- Group information under short **bold headings** like **Patient Info**, **Records**, **Medications**
- For patient lists, use:
  1. **Patient Name** — Age/Gender | Condition: Diabetes
- Never use markdown tables (they don't display well in chat)

For general medical questions, provide information but remind that clinical judgment is essential.
Always fetch actual patient data when available.
""",
    
    "PATIENT": """You are a helpful AI assistant for the Health Atlas medical records management system, speaking to a **Patient**.

As a Patient's assistant, you help navigate the healthcare platform:

**Your Capabilities:**
- Show your medical records and documents
- Explain medical terms in simple language
- Help manage consent requests from doctors
- List your treating doctors and their information
- Guide through document upload and profile management
- Answer questions about your health data

**Important Guidelines:**
1. Be empathetic, patient, and supportive
2. Explain medical concepts in simple, understandable terms
3. Encourage patients to consult healthcare professionals for medical advice
4. Help patients understand and control their health data
5. Respect patient privacy and dignity

**Response Formatting Rules (IMPORTANT — follow strictly):**
- Use **bold** for doctor names, medications, and important values
- Use bullet points or numbered lists — NOT markdown tables
- Use emojis for warmth and clarity: 👨‍⚕️ doctor, 💊 medication, 📋 records, ✅ approved, ⏳ pending, 💡 tip
- Keep responses friendly, warm, and easy to scan
- Group information under short **bold headings**
- Never use markdown tables (they don't display well in chat)

For medical questions, provide general information but always remind patients to consult their doctors.
Use available functions to show the patient's REAL data.
"""
}

def get_system_prompt(user_role: str) -> str:
    """Get system prompt based on user role"""
    return SYSTEM_PROMPTS.get(user_role, SYSTEM_PROMPTS["PATIENT"])

# Backend API configuration
BACKEND_URL = os.getenv("HEALTHATLAS_API_URL", "http://localhost:8080/api")
ADMIN_EMAIL = os.getenv("CHATBOT_ADMIN_EMAIL", "admin@healthatlas.com")
ADMIN_PASSWORD = os.getenv("CHATBOT_ADMIN_PASSWORD", "Password123!")

# Global variable to store JWT token
auth_token = None

async def login_and_get_token():
    """Login to Health Atlas backend and get JWT token"""
    global auth_token
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{BACKEND_URL}/auth/login",
                json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
                timeout=10.0
            )
            if response.status_code == 200:
                data = response.json()
                auth_token = data.get("token")
                print(f"[OK] Logged in as {data.get('email')} (Role: {data.get('role')})")
                return True
            else:
                print(f"[ERROR] Login failed: {response.status_code}")
                return False
    except Exception as e:
        print(f"[ERROR] Login error: {e}")
        return False

# Function definitions for OpenAI - organized by role
ADMIN_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_pending_approvals",
            "description": "Get list of all pending user approvals (doctors and patients waiting for admin approval)",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_all_patients",
            "description": "Get list of all patients in the system",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_all_doctors",
            "description": "Get list of all doctors in the system",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_all_consents",
            "description": "Get all consent requests in the system including pending, approved, and revoked consents between doctors and patients",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "admin_approve_consent",
            "description": "Approve a pending consent request on behalf of a patient (Admin override). IMPORTANT: The consent_id must be the actual database ID from the consent data (the 'id' field), NOT a list position number.",
            "parameters": {
                "type": "object",
                "properties": {
                    "consent_id": {
                        "type": "integer",
                        "description": "The actual database consent ID (from the 'id' field in consent data). Do NOT use list position numbers."
                    }
                },
                "required": ["consent_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_dashboard_stats",
            "description": "Get system-wide dashboard statistics including total users, patients, doctors, medical records, and consent counts (total, pending, approved)",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    }
]

DOCTOR_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_my_patients",
            "description": "Get list of all patients with their consent status for this doctor"  ,
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_patients_by_organ",
            "description": "Search for patients who have medical records for a specific organ",
            "parameters": {
                "type": "object",
                "properties": {
                    "organ_name": {
                        "type": "string",
                        "description": "The organ name to search for (e.g., 'heart', 'lungs', 'liver')"
                    }
                },
                "required": ["organ_name"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_patient_details",
            "description": "Get detailed information about a specific patient including medical records",
            "parameters": {
                "type": "object",
                "properties": {
                    "patient_id": {
                        "type": "integer",
                        "description": "The patient ID"
                    }
                },
                "required": ["patient_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_pending_consents",
            "description": "Get list of pending consent requests from the doctor's patients",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_patient_summary",
            "description": "Get a comprehensive medical summary for a patient including all medical records, prescriptions with medicines, uploaded documents, and clinical notes. Use this when a doctor asks for a complete overview or summary of a patient's health.",
            "parameters": {
                "type": "object",
                "properties": {
                    "patient_id": {
                        "type": "integer",
                        "description": "The patient ID to get the summary for"
                    }
                },
                "required": ["patient_id"]
            }
        }
    }
]

PATIENT_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_my_doctors",
            "description": "Get list of doctors treating this patient (from consent records which include doctor details)",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_my_consents",
            "description": "Get list of consent requests for this patient",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_my_medical_records",
            "description": "Get this patient's medical records and uploaded documents",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    }
]

def get_tools_for_role(user_role: str) -> list:
    """Get available tools based on user role"""
    if user_role == "ADMIN":
        return ADMIN_TOOLS
    elif user_role == "DOCTOR":
        return DOCTOR_TOOLS
    elif user_role == "PATIENT":
        return PATIENT_TOOLS
    return []  # No tools for unknown roles

# Function implementations
async def call_backend_api(endpoint: str, method: str = "GET", params: dict = None, user_token: str = None):
    """Call the Health Atlas backend API with authentication"""
    global auth_token
    
    # Use user token if provided, otherwise use admin token
    token = user_token if user_token else auth_token
    
    # Ensure we have a token
    if not token and not auth_token:
        await login_and_get_token()
        token = auth_token
    
    try:
        headers = {}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        
        async with httpx.AsyncClient() as client:
            url = f"{BACKEND_URL}/{endpoint}"
            if method == "GET":
                response = await client.get(url, params=params, headers=headers, timeout=10.0)
            else:
                response = await client.request(method, url, json=params, headers=headers, timeout=10.0)
            
            if 200 <= response.status_code < 300:
                return response.json()
            elif response.status_code == 401:
                # Token expired, try to login again
                if await login_and_get_token():
                    # Retry the request
                    headers["Authorization"] = f"Bearer {auth_token}"
                    response = await client.request(method, url, json=params, headers=headers, timeout=10.0)
                    if 200 <= response.status_code < 300:
                        return response.json()
                return {"error": "Authentication failed"}
            else:
                # Try to return JSON body for informative error responses (e.g. 409 conflict)
                try:
                    return response.json()
                except Exception:
                    return {"error": f"API returned status {response.status_code}: {response.text}"}
    except Exception as e:
        return {"error": str(e)}

# Admin functions
async def get_pending_approvals(user_token: str = None):
    """Get pending user approvals"""
    return await call_backend_api("admin/pending-approvals", user_token=user_token)

async def get_all_patients(user_token: str = None):
    """Get all patients (admin only)"""
    return await call_backend_api("admin/patients", user_token=user_token)

async def get_all_doctors(user_token: str = None):
    """Get all doctors"""
    return await call_backend_api("admin/doctors", user_token=user_token)

async def get_all_consents(user_token: str = None):
    """Get all consent requests (admin)"""
    return await call_backend_api("admin/consents", user_token=user_token)

async def admin_approve_consent(consent_id: int, user_token: str = None):
    """Admin approve a consent request"""
    return await call_backend_api(f"admin/consent/{consent_id}/approve", method="PUT", user_token=user_token)

async def get_dashboard_stats(user_token: str = None):
    """Get system-wide dashboard statistics"""
    return await call_backend_api("admin/dashboard/stats", user_token=user_token)

# Doctor functions
async def get_my_patients(doctor_id: int, user_token: str = None):
    """Get all patients with consent status for this doctor"""
    return await call_backend_api(f"doctor/{doctor_id}/patients", user_token=user_token)

async def search_patients_by_organ(organ_name: str, user_token: str = None):
    """Search patients by organ"""
    return await call_backend_api(f"doctor/patients/organ/{organ_name}", user_token=user_token)

async def get_patient_details(patient_id: int, user_token: str = None):
    """Get patient details"""
    return await call_backend_api(f"doctor/patients/{patient_id}", user_token=user_token)

async def get_pending_consents(doctor_id: int, user_token: str = None):
    """Get pending consent requests for doctor"""
    return await call_backend_api(f"doctor/{doctor_id}/consents", user_token=user_token)

async def get_patient_summary(patient_id: int, user_token: str = None):
    """Get comprehensive patient medical summary"""
    return await call_backend_api(f"patient/{patient_id}/summary", user_token=user_token)

# Patient functions
async def get_my_doctors(patient_id: int, user_token: str = None):
    """Get list of doctors treating this patient (extracted from consents)"""
    return await call_backend_api(f"patient/{patient_id}/consents", user_token=user_token)
    # Doctors are linked to patients through consents — extract doctor info from consent data

async def get_my_consents(patient_id: int, user_token: str = None):
    """Get consent requests for this patient"""
    return await call_backend_api(f"patient/{patient_id}/consents", user_token=user_token)

async def get_my_medical_records(patient_id: int, user_token: str = None):
    """Get patient's medical records"""
    return await call_backend_api(f"patient/{patient_id}/records", user_token=user_token)

async def execute_function(function_name: str, arguments: dict, user_token: str = None, user_id: int = None):
    """Execute a function call"""
    # Admin functions
    if function_name == "get_pending_approvals":
        return await get_pending_approvals(user_token)
    elif function_name == "get_all_patients":
        return await get_all_patients(user_token)
    elif function_name == "get_all_doctors":
        return await get_all_doctors(user_token)
    elif function_name == "get_all_consents":
        return await get_all_consents(user_token)
    elif function_name == "admin_approve_consent":
        return await admin_approve_consent(arguments.get("consent_id"), user_token)
    elif function_name == "get_dashboard_stats":
        return await get_dashboard_stats(user_token)
    # Doctor functions
    elif function_name == "get_my_patients":
        return await get_my_patients(user_id, user_token)
    elif function_name == "search_patients_by_organ":
        return await search_patients_by_organ(arguments.get("organ_name"), user_token)
    elif function_name == "get_patient_details":
        return await get_patient_details(arguments.get("patient_id"), user_token)
    elif function_name == "get_pending_consents":
        return await get_pending_consents(user_id, user_token)
    elif function_name == "get_patient_summary":
        return await get_patient_summary(arguments.get("patient_id"), user_token)
    # Patient functions
    elif function_name == "get_my_doctors":
        return await get_my_doctors(user_id, user_token)
    elif function_name == "get_my_consents":
        return await get_my_consents(user_id, user_token)
    elif function_name == "get_my_medical_records":
        return await get_my_medical_records(user_id, user_token)
    else:
        return {"error": f"Unknown function: {function_name}"}

# Request/Response models
class ChatRequest(BaseModel):
    messages: list[dict]
    user_role: str = None  # ADMIN, DOCTOR, or PATIENT
    user_token: str = None  # User's JWT token
    user_id: int = None  # User's ID

class ChatResponse(BaseModel):
    response: str
    model: str

# Initialize OpenAI client
def get_client():
    api_key = os.getenv("GITHUB_TOKEN") or os.getenv("AZURE_OPENAI_API_KEY")
    endpoint = os.getenv("CHAT_ENDPOINT", "https://models.github.ai/inference")
    
    if not api_key or api_key == "your_github_token_here_replace_this":
        raise ValueError("Missing GitHub Token - check .env file")
    
    return AsyncOpenAI(base_url=endpoint, api_key=api_key)

model_name = os.getenv("CHAT_MODEL", "gpt-4o")

@app.get("/")
async def root():
    return {"status": "online", "service": "Health Atlas AI Chatbot"}

@app.get("/health")
async def health_check():
    """Health check endpoint for Render deployment"""
    return {"status": "UP", "service": "health-atlas-chatbot"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        client = get_client()
        
        # Get role-based system prompt and tools
        user_role = request.user_role or "PATIENT"  # Default to PATIENT if not provided
        system_prompt = get_system_prompt(user_role)
        available_tools = get_tools_for_role(user_role)
        
        messages = [{"role": "system", "content": system_prompt}]
        messages.extend(request.messages)
        
        # First request to OpenAI with role-based tools
        response_params = {
            "model": model_name,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 1500
        }
        
        # Only add tools if available for this role
        if available_tools:
            response_params["tools"] = available_tools
        
        response = await client.chat.completions.create(**response_params)
        
        # Loop to handle multi-step tool calls (e.g., list consents then approve them)
        max_rounds = 5
        round_count = 0
        while response.choices[0].message.tool_calls and round_count < max_rounds:
            round_count += 1
            # Execute all function calls in this round
            messages.append(response.choices[0].message)
            
            for tool_call in response.choices[0].message.tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)
                
                # Execute the function with user context
                function_result = await execute_function(
                    function_name, 
                    function_args,
                    user_token=request.user_token,
                    user_id=request.user_id
                )
                
                # Add function result to messages
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps(function_result)
                })
            
            # Next request with tool results — keep tools available for follow-up calls
            next_params = {
                "model": model_name,
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 1500
            }
            if available_tools:
                next_params["tools"] = available_tools
            
            response = await client.chat.completions.create(**next_params)
        
        return ChatResponse(
            response=response.choices[0].message.content,
            model=model_name
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def main():
    print("\n" + "=" * 50)
    print("Health Atlas AI Chatbot")
    print("=" * 50 + "\n")
    
    api_key = os.getenv("GITHUB_TOKEN") or os.getenv("AZURE_OPENAI_API_KEY")
    if not api_key or api_key == "your_github_token_here_replace_this":
        print("Missing GitHub Token!")
        print("Edit medical-chatbot/.env and add your GitHub token\n")
        return
    
    port = int(os.getenv("CHATBOT_PORT", "8087"))
    print(f"Server: http://localhost:{port}")
    print(f"Model: {model_name}")
    print(f"Backend: {BACKEND_URL}\n")
    
    # Login to backend
    import asyncio
    if asyncio.run(login_and_get_token()):
        print("\nReady! Press Ctrl+C to stop.\n" + "=" * 50 + "\n")
        uvicorn.run(app, host="0.0.0.0", port=port, log_level="warning")
    else:
        print("Failed to login to backend. Check credentials.")

if __name__ == "__main__":
    main()
