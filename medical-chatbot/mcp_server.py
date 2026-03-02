"""
Health Atlas MCP Server
Provides tools for the AI chatbot to interact with the Java backend API
"""

import os
import asyncio
import httpx
from typing import Any
from mcp.server.models import InitializationOptions
from mcp.server import NotificationOptions, Server
from mcp.server.stdio import stdio_server
from mcp.types import (
    Tool,
    TextContent,
    ImageContent,
    EmbeddedResource,
    INVALID_PARAMS,
    INTERNAL_ERROR
)
from pydantic import AnyUrl

# Health Atlas API base URL
API_BASE_URL = os.getenv("HEALTHATLAS_API_URL", "http://localhost:8080/api")
# For authenticated requests (you can add token logic later)
API_HEADERS = {
    "Content-Type": "application/json"
}

# Initialize MCP server
server = Server("healthatlas-mcp")

# HTTP client for API calls
http_client = httpx.AsyncClient(timeout=30.0)


@server.list_tools()
async def handle_list_tools() -> list[Tool]:
    """
    List all available tools for the Health Atlas chatbot.
    These tools allow the AI to interact with the Java backend.
    """
    return [
        # Admin Tools
        Tool(
            name="get_pending_approvals",
            description="Get list of users pending approval (Admin only). Returns users waiting for admin approval to access the system.",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            },
        ),
        Tool(
            name="approve_user",
            description="Approve a pending user registration (Admin only). Activates the user account.",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "integer",
                        "description": "The ID of the user to approve"
                    }
                },
                "required": ["user_id"]
            },
        ),
        Tool(
            name="get_all_patients",
            description="Get list of all patients in the system (Admin/Doctor). Returns basic patient information.",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            },
        ),
        Tool(
            name="get_all_doctors",
            description="Get list of all doctors in the system (Admin). Returns doctor information including specialization.",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            },
        ),
        Tool(
            name="toggle_user_status",
            description="Activate or deactivate a user account (Admin only). Toggles the user's active status.",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "integer",
                        "description": "The ID of the user to toggle"
                    }
                },
                "required": ["user_id"]
            },
        ),
        
        # Patient Tools
        Tool(
            name="get_patient_details",
            description="Get detailed information about a specific patient including medical records count.",
            inputSchema={
                "type": "object",
                "properties": {
                    "patient_id": {
                        "type": "integer",
                        "description": "The ID of the patient"
                    }
                },
                "required": ["patient_id"]
            },
        ),
        Tool(
            name="search_patients_by_organ",
            description="Search for patients by organ type (e.g., Heart, Liver, Kidney).",
            inputSchema={
                "type": "object",
                "properties": {
                    "organ_type": {
                        "type": "string",
                        "description": "The organ type to search for (HEART, LIVER, KIDNEY, LUNG, BRAIN, PANCREAS, INTESTINE, STOMACH, OTHER)"
                    }
                },
                "required": ["organ_type"]
            },
        ),
        
        # Doctor Tools
        Tool(
            name="get_doctor_details",
            description="Get detailed information about a specific doctor including their patients and records.",
            inputSchema={
                "type": "object",
                "properties": {
                    "doctor_id": {
                        "type": "integer",
                        "description": "The ID of the doctor"
                    }
                },
                "required": ["doctor_id"]
            },
        ),
        Tool(
            name="get_doctor_records",
            description="Get all medical records created by a specific doctor.",
            inputSchema={
                "type": "object",
                "properties": {
                    "doctor_id": {
                        "type": "integer",
                        "description": "The ID of the doctor"
                    }
                },
                "required": ["doctor_id"]
            },
        ),
        
        # Medical Records Tools
        Tool(
            name="get_patient_medical_records",
            description="Get all medical records for a specific patient.",
            inputSchema={
                "type": "object",
                "properties": {
                    "patient_id": {
                        "type": "integer",
                        "description": "The ID of the patient"
                    }
                },
                "required": ["patient_id"]
            },
        ),
        Tool(
            name="get_records_by_organ",
            description="Get medical records filtered by organ type.",
            inputSchema={
                "type": "object",
                "properties": {
                    "organ_type": {
                        "type": "string",
                        "description": "The organ type (HEART, LIVER, KIDNEY, etc.)"
                    }
                },
                "required": ["organ_type"]
            },
        ),
        
        # Consent Tools
        Tool(
            name="get_patient_consents",
            description="Get all consent records for a specific patient.",
            inputSchema={
                "type": "object",
                "properties": {
                    "patient_id": {
                        "type": "integer",
                        "description": "The ID of the patient"
                    }
                },
                "required": ["patient_id"]
            },
        ),
        Tool(
            name="get_doctor_consents",
            description="Get all consent records for a specific doctor.",
            inputSchema={
                "type": "object",
                "properties": {
                    "doctor_id": {
                        "type": "integer",
                        "description": "The ID of the doctor"
                    }
                },
                "required": ["doctor_id"]
            },
        ),
        Tool(
            name="get_all_consents",
            description="Get all consent requests in the system (Admin). Returns all consents with status, patient/doctor info.",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            },
        ),
        Tool(
            name="admin_approve_consent",
            description="Approve a pending consent request on behalf of a patient (Admin override).",
            inputSchema={
                "type": "object",
                "properties": {
                    "consent_id": {
                        "type": "integer",
                        "description": "The ID of the consent to approve"
                    }
                },
                "required": ["consent_id"]
            },
        ),
        Tool(
            name="get_dashboard_stats",
            description="Get system-wide dashboard statistics including user counts, medical records, and consent statistics (total, pending, approved).",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            },
        ),
        
        # Patient Summary Tool
        Tool(
            name="get_patient_summary",
            description="Get a comprehensive medical summary for a patient including all medical records, prescriptions with medicines, uploaded documents, and clinical notes. Use this when asked for a complete overview or summary of a patient's health.",
            inputSchema={
                "type": "object",
                "properties": {
                    "patient_id": {
                        "type": "integer",
                        "description": "The ID of the patient to summarize"
                    }
                },
                "required": ["patient_id"]
            },
        ),
        
        # General Help
        Tool(
            name="get_system_info",
            description="Get general information about Health Atlas system features and capabilities.",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            },
        ),
    ]


@server.call_tool()
async def handle_call_tool(
    name: str, arguments: dict | None
) -> list[TextContent | ImageContent | EmbeddedResource]:
    """
    Handle tool execution by calling the appropriate Java backend API endpoint.
    """
    
    try:
        if arguments is None:
            arguments = {}
        
        # Admin Tools
        if name == "get_pending_approvals":
            response = await http_client.get(f"{API_BASE_URL}/admin/pending-users")
            response.raise_for_status()
            data = response.json()
            return [TextContent(type="text", text=f"Pending approvals:\n{format_response(data)}")]
        
        elif name == "approve_user":
            user_id = arguments.get("user_id")
            response = await http_client.put(f"{API_BASE_URL}/admin/approve-user/{user_id}")
            response.raise_for_status()
            data = response.json()
            return [TextContent(type="text", text=f"User approved successfully:\n{format_response(data)}")]
        
        elif name == "get_all_patients":
            response = await http_client.get(f"{API_BASE_URL}/admin/patients")
            response.raise_for_status()
            data = response.json()
            return [TextContent(type="text", text=f"Patients list:\n{format_response(data)}")]
        
        elif name == "get_all_doctors":
            response = await http_client.get(f"{API_BASE_URL}/admin/doctors")
            response.raise_for_status()
            data = response.json()
            return [TextContent(type="text", text=f"Doctors list:\n{format_response(data)}")]
        
        elif name == "toggle_user_status":
            user_id = arguments.get("user_id")
            response = await http_client.put(f"{API_BASE_URL}/admin/user/{user_id}/toggle-active")
            response.raise_for_status()
            data = response.json()
            return [TextContent(type="text", text=f"User status updated:\n{format_response(data)}")]
        
        # Patient Tools
        elif name == "get_patient_details":
            patient_id = arguments.get("patient_id")
            response = await http_client.get(f"{API_BASE_URL}/admin/patient/{patient_id}/details")
            response.raise_for_status()
            data = response.json()
            return [TextContent(type="text", text=f"Patient details:\n{format_response(data)}")]
        
        elif name == "search_patients_by_organ":
            organ_type = arguments.get("organ_type", "").upper()
            response = await http_client.get(f"{API_BASE_URL}/records/organ/{organ_type}")
            response.raise_for_status()
            data = response.json()
            # Extract unique patients from records
            patient_ids = set()
            for record in data:
                if 'patient' in record:
                    patient_ids.add(record['patient']['id'])
            return [TextContent(type="text", text=f"Found {len(patient_ids)} patients with {organ_type} records:\n{format_response(data)}")]
        
        # Doctor Tools
        elif name == "get_doctor_details":
            doctor_id = arguments.get("doctor_id")
            response = await http_client.get(f"{API_BASE_URL}/admin/doctor/{doctor_id}/details")
            response.raise_for_status()
            data = response.json()
            return [TextContent(type="text", text=f"Doctor details:\n{format_response(data)}")]
        
        elif name == "get_doctor_records":
            doctor_id = arguments.get("doctor_id")
            response = await http_client.get(f"{API_BASE_URL}/admin/doctor/{doctor_id}/records")
            response.raise_for_status()
            data = response.json()
            return [TextContent(type="text", text=f"Doctor's medical records:\n{format_response(data)}")]
        
        # Medical Records Tools
        elif name == "get_patient_medical_records":
            patient_id = arguments.get("patient_id")
            response = await http_client.get(f"{API_BASE_URL}/records/patient/{patient_id}")
            response.raise_for_status()
            data = response.json()
            return [TextContent(type="text", text=f"Patient's medical records:\n{format_response(data)}")]
        
        elif name == "get_records_by_organ":
            organ_type = arguments.get("organ_type", "").upper()
            response = await http_client.get(f"{API_BASE_URL}/records/organ/{organ_type}")
            response.raise_for_status()
            data = response.json()
            return [TextContent(type="text", text=f"Medical records for {organ_type}:\n{format_response(data)}")]
        
        # Consent Tools
        elif name == "get_patient_consents":
            patient_id = arguments.get("patient_id")
            response = await http_client.get(f"{API_BASE_URL}/patient/{patient_id}/consents")
            response.raise_for_status()
            data = response.json()
            return [TextContent(type="text", text=f"Patient's consents:\n{format_response(data)}")]
        
        elif name == "get_doctor_consents":
            doctor_id = arguments.get("doctor_id")
            response = await http_client.get(f"{API_BASE_URL}/doctor/{doctor_id}/consents")
            response.raise_for_status()
            data = response.json()
            return [TextContent(type="text", text=f"Doctor's consents:\n{format_response(data)}")]
        
        elif name == "get_all_consents":
            response = await http_client.get(f"{API_BASE_URL}/admin/consents")
            response.raise_for_status()
            data = response.json()
            return [TextContent(type="text", text=f"All consents in the system:\n{format_response(data)}")]
        
        elif name == "admin_approve_consent":
            consent_id = arguments.get("consent_id")
            response = await http_client.put(f"{API_BASE_URL}/admin/consent/{consent_id}/approve")
            response.raise_for_status()
            data = response.json()
            return [TextContent(type="text", text=f"Consent approved:\n{format_response(data)}")]
        
        elif name == "get_dashboard_stats":
            response = await http_client.get(f"{API_BASE_URL}/admin/dashboard/stats")
            response.raise_for_status()
            data = response.json()
            return [TextContent(type="text", text=f"Dashboard statistics:\n{format_response(data)}")]
        
        # Patient Summary
        elif name == "get_patient_summary":
            patient_id = arguments.get("patient_id")
            response = await http_client.get(f"{API_BASE_URL}/patient/{patient_id}/summary")
            response.raise_for_status()
            data = response.json()
            return [TextContent(type="text", text=f"Comprehensive patient summary:\n{format_response(data)}")]
        
        # General Help
        elif name == "get_system_info":
            info = {
                "system": "Health Atlas",
                "version": "1.0",
                "features": [
                    "Patient medical records management",
                    "Doctor-patient consent tracking",
                    "User approval workflow",
                    "Organ-specific record tracking",
                    "Document upload and management"
                ],
                "user_roles": ["Admin", "Doctor", "Patient"],
                "available_organs": ["HEART", "LIVER", "KIDNEY", "LUNG", "BRAIN", "PANCREAS", "INTESTINE", "STOMACH", "OTHER"]
            }
            return [TextContent(type="text", text=f"Health Atlas System Information:\n{format_response(info)}")]
        
        else:
            raise ValueError(f"Unknown tool: {name}")
    
    except httpx.HTTPStatusError as e:
        error_msg = f"API Error: {e.response.status_code} - {e.response.text}"
        return [TextContent(type="text", text=error_msg)]
    except Exception as e:
        error_msg = f"Error executing {name}: {str(e)}"
        return [TextContent(type="text", text=error_msg)]


def format_response(data: Any) -> str:
    """Format the API response in a readable way."""
    import json
    return json.dumps(data, indent=2, ensure_ascii=False)


async def main():
    """Run the MCP server using stdio transport."""
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="healthatlas-mcp",
                server_version="1.0.0",
                capabilities=server.get_capabilities(
                    notification_options=NotificationOptions(),
                    experimental_capabilities={},
                ),
            ),
        )


if __name__ == "__main__":
    asyncio.run(main())
