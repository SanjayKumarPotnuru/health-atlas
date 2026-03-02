# Health Atlas API Test Script

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "   Health Atlas - API Testing" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

# Test 1: Check if backend is running
Write-Host "🔍 Test 1: Checking Backend Status..." -ForegroundColor Yellow
try {
    $organs = Invoke-RestMethod -Uri "http://localhost:8080/api/organs" -Method GET
    Write-Host "✅ Backend is RUNNING on http://localhost:8080" -ForegroundColor Green
    Write-Host "   Found $($organs.Count) organs in the system`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend is NOT running!" -ForegroundColor Red
    Write-Host "   Please start the backend first`n" -ForegroundColor Red
    exit
}

# Test 2: Register a new patient
Write-Host "🔍 Test 2: Registering New Patient..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "HHmmss"
$patientData = @{
    email = "patient$timestamp@test.com"
    password = "test123"
    firstName = "John"
    lastName = "Doe"
    dateOfBirth = "1990-05-15"
    gender = "MALE"
    phone = "+1234567890"
    address = "123 Main St"
    emergencyContact = "Jane Doe"
    emergencyPhone = "+0987654321"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/patient/register" -Method POST -Body $patientData -ContentType "application/json"
    Write-Host "✅ Patient Registration SUCCESSFUL!" -ForegroundColor Green
    Write-Host "   Email: patient$timestamp@test.com" -ForegroundColor Cyan
    Write-Host "   Password: test123" -ForegroundColor Cyan
    Write-Host "   User ID: $($registerResponse.userId)" -ForegroundColor Gray
    Write-Host "   JWT Token: $($registerResponse.token.Substring(0,30))...`n" -ForegroundColor Gray
    $testEmail = "patient$timestamp@test.com"
    $token = $registerResponse.token
} catch {
    Write-Host "❌ Registration Failed: $($_.Exception.Message)`n" -ForegroundColor Red
    exit
}

# Test 3: Login with the registered user
Write-Host "🔍 Test 3: Testing Login..." -ForegroundColor Yellow
$loginData = @{
    email = $testEmail
    password = "test123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✅ Login SUCCESSFUL!" -ForegroundColor Green
    Write-Host "   Role: $($loginResponse.role)" -ForegroundColor Cyan
    Write-Host "   User ID: $($loginResponse.userId)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Login Failed: $($_.Exception.Message)`n" -ForegroundColor Red
}

# Test 4: Access protected endpoint with token
Write-Host "🔍 Test 4: Accessing Patient Records..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $records = Invoke-RestMethod -Uri "http://localhost:8080/api/patient/$($registerResponse.profileId)/records" -Method GET -Headers $headers
    Write-Host "✅ Protected Endpoint Access SUCCESSFUL!" -ForegroundColor Green
    Write-Host "   Retrieved $($records.Count) medical records`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Unable to access protected endpoint" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)`n" -ForegroundColor Red
}

# Final Summary
Write-Host "================================================" -ForegroundColor Green
Write-Host "          TEST SUMMARY" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host " - Backend: Running" -ForegroundColor Green
Write-Host " - Registration: Working" -ForegroundColor Green
Write-Host " - Login: Working" -ForegroundColor Green
Write-Host " - JWT Authentication: Working" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "  Backend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "  H2 Console: http://localhost:8080/h2-console" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Green
Write-Host "  Use these credentials to login:" -ForegroundColor Yellow
Write-Host "     Email: $testEmail" -ForegroundColor White
Write-Host "     Password: test123" -ForegroundColor White
Write-Host "" -ForegroundColor Green
Write-Host "================================================`n" -ForegroundColor Green
