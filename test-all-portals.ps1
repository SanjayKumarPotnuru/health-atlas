# Health Atlas - Complete Portal Testing Script
# Tests all 3 user types: Admin, Doctor, Patient

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   HEALTH ATLAS - FULL PORTAL TESTING" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8080/api"
$chatbotUrl = "http://localhost:8087"

function Test-Login {
    param($email, $password, $expectedRole)
    
    $body = @{email=$email; password=$password} | ConvertTo-Json
    $body | Out-File -Encoding utf8 -FilePath temp_login.json -NoNewline
    
    try {
        $result = curl.exe -s -X POST "$baseUrl/auth/login" -H "Content-Type: application/json" -d "@temp_login.json" | ConvertFrom-Json
        if ($result.token) {
            Write-Host "  [PASS] Login successful - Role: $($result.role)" -ForegroundColor Green
            return $result
        } else {
            Write-Host "  [FAIL] Login failed: $($result.message)" -ForegroundColor Red
            return $null
        }
    } catch {
        Write-Host "  [FAIL] Login error: $_" -ForegroundColor Red
        return $null
    }
}

function Test-Endpoint {
    param($name, $url, $token, $method = "GET")
    
    try {
        $result = curl.exe -s -X $method $url -H "Authorization: Bearer $token" -H "Content-Type: application/json"
        $parsed = $result | ConvertFrom-Json -ErrorAction SilentlyContinue
        if ($parsed -or $result -eq "[]") {
            Write-Host "  [PASS] $name" -ForegroundColor Green
            return $parsed
        } else {
            Write-Host "  [WARN] $name - Response: $($result.Substring(0, [Math]::Min(100, $result.Length)))" -ForegroundColor Yellow
            return $null
        }
    } catch {
        Write-Host "  [FAIL] $name - Error: $_" -ForegroundColor Red
        return $null
    }
}

function Test-Chatbot {
    param($message, $token, $role, $userId)
    
    try {
        $body = @{
            messages = @(@{role="user"; content=$message})
            user_role = $role
            user_token = $token
            user_id = $userId
        } | ConvertTo-Json -Depth 5
        $body | Out-File -Encoding utf8 -FilePath temp_chat.json -NoNewline
        $result = curl.exe -s -X POST "$chatbotUrl/chat" -H "Content-Type: application/json" -d "@temp_chat.json" | ConvertFrom-Json
        if ($result.response) {
            Write-Host "  [PASS] Chatbot responded: $($result.response.Substring(0, [Math]::Min(100, $result.response.Length)))..." -ForegroundColor Green
            return $result
        } else {
            Write-Host "  [WARN] Chatbot: $($result | ConvertTo-Json -Compress)" -ForegroundColor Yellow
            return $null
        }
    } catch {
        Write-Host "  [FAIL] Chatbot error: $_" -ForegroundColor Red
        return $null
    }
}

# ============================================
# TEST 1: ADMIN PORTAL
# ============================================
Write-Host ""
Write-Host "========== ADMIN PORTAL ==========" -ForegroundColor Magenta
Write-Host "Login: admin@healthatlas.com" -ForegroundColor White

$admin = Test-Login -email "admin@healthatlas.com" -password "Password123!" -expectedRole "ADMIN"

if ($admin.token) {
    Write-Host ""
    Write-Host "Testing Admin Features:" -ForegroundColor Yellow
    
    # Get dashboard stats
    $stats = Test-Endpoint -name "Get Dashboard Stats" -url "$baseUrl/admin/dashboard/stats" -token $admin.token
    if ($stats) { 
        Write-Host "    -> Total Users: $($stats.totalUsers), Patients: $($stats.totalPatients), Doctors: $($stats.totalDoctors)" -ForegroundColor Gray 
    }
    
    # Get all users
    $users = Test-Endpoint -name "Get All Users" -url "$baseUrl/admin/users" -token $admin.token
    if ($users) { Write-Host "    -> Found $($users.Count) users" -ForegroundColor Gray }
    
    # Get all doctors
    $doctors = Test-Endpoint -name "Get All Doctors" -url "$baseUrl/admin/doctors" -token $admin.token
    if ($doctors) { Write-Host "    -> Found $($doctors.Count) doctors" -ForegroundColor Gray }
    
    # Get all patients  
    $patients = Test-Endpoint -name "Get All Patients" -url "$baseUrl/admin/patients" -token $admin.token
    if ($patients) { Write-Host "    -> Found $($patients.Count) patients" -ForegroundColor Gray }
    
    # Get all medical records
    Test-Endpoint -name "Get All Medical Records" -url "$baseUrl/admin/medical-records" -token $admin.token
    
    # Get all consents
    Test-Endpoint -name "Get All Consents" -url "$baseUrl/admin/consents" -token $admin.token
    
    # Get pending approvals
    Test-Endpoint -name "Get Pending Approvals" -url "$baseUrl/admin/pending-approvals" -token $admin.token
    
    # Test Admin Chatbot
    Write-Host ""
    Write-Host "Testing Admin Chatbot:" -ForegroundColor Yellow
    Test-Chatbot -message "How many users are registered?" -token $admin.token -role "ADMIN" -userId $admin.userId
}

# ============================================
# TEST 2: DOCTOR PORTAL
# ============================================
Write-Host ""
Write-Host "========== DOCTOR PORTAL ==========" -ForegroundColor Magenta
Write-Host "Login: dr.rajesh.sharma@healthatlas.com" -ForegroundColor White

$doctor = Test-Login -email "dr.rajesh.sharma@healthatlas.com" -password "Password123!" -expectedRole "DOCTOR"

if ($doctor.token) {
    $doctorUserId = $doctor.userId
    $doctorProfileId = $doctor.profileId
    Write-Host "  Doctor UserId: $doctorUserId, ProfileId: $doctorProfileId" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Testing Doctor Features:" -ForegroundColor Yellow
    
    # Get doctor profile using userId
    Test-Endpoint -name "Get Doctor Profile" -url "$baseUrl/doctor/$doctorUserId/profile" -token $doctor.token
    
    # Get doctor's prescriptions
    $prescriptions = Test-Endpoint -name "Get My Prescriptions" -url "$baseUrl/doctor/$doctorProfileId/prescriptions" -token $doctor.token
    if ($prescriptions) { Write-Host "    -> Found $($prescriptions.Count) prescriptions" -ForegroundColor Gray }
    
    # Get organs list
    Test-Endpoint -name "Get Organs List" -url "$baseUrl/organs" -token $doctor.token
    
    # Test Doctor Chatbot
    Write-Host ""
    Write-Host "Testing Doctor Chatbot:" -ForegroundColor Yellow
    Test-Chatbot -message "Show me my patients" -token $doctor.token -role "DOCTOR" -userId $doctorUserId
}

# ============================================
# TEST 3: PATIENT PORTAL
# ============================================
Write-Host ""
Write-Host "========== PATIENT PORTAL ==========" -ForegroundColor Magenta
Write-Host "Login: arjun.menon@email.com" -ForegroundColor White

$patient = Test-Login -email "arjun.menon@email.com" -password "Password123!" -expectedRole "PATIENT"

if ($patient.token) {
    $patientUserId = $patient.userId
    $patientProfileId = $patient.profileId
    Write-Host "  Patient UserId: $patientUserId, ProfileId: $patientProfileId" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Testing Patient Features:" -ForegroundColor Yellow
    
    # Get patient profile using userId
    Test-Endpoint -name "Get Patient Profile" -url "$baseUrl/patient/$patientUserId/profile" -token $patient.token
    
    # Get patient's medical records
    $records = Test-Endpoint -name "Get My Medical Records" -url "$baseUrl/patient/$patientProfileId/records" -token $patient.token
    if ($records) { Write-Host "    -> Found $($records.Count) records" -ForegroundColor Gray }
    
    # Get patient's prescriptions
    $prescriptions = Test-Endpoint -name "Get My Prescriptions" -url "$baseUrl/patient/$patientProfileId/prescriptions" -token $patient.token
    if ($prescriptions) { Write-Host "    -> Found $($prescriptions.Count) prescriptions" -ForegroundColor Gray }
    
    # Get patient summary
    Test-Endpoint -name "Get Patient Summary" -url "$baseUrl/patient/$patientProfileId/summary" -token $patient.token
    
    # Get organs list
    Test-Endpoint -name "Get Organs List" -url "$baseUrl/organs" -token $patient.token
    
    # Test Patient Chatbot
    Write-Host ""
    Write-Host "Testing Patient Chatbot:" -ForegroundColor Yellow
    Test-Chatbot -message "Show me my medical records" -token $patient.token -role "PATIENT" -userId $patientUserId
}

# ============================================
# SUMMARY
# ============================================
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   TEST SUMMARY COMPLETE" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Cleanup
Remove-Item -Path temp_login.json -ErrorAction SilentlyContinue
Remove-Item -Path temp_chat.json -ErrorAction SilentlyContinue
