# Comprehensive Test for Health Atlas Chatbot

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Health Atlas AI Chatbot - Full Test  " -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

function Test-ChatbotQuery {
    param(
        [string]$TestName,
        [string]$Query
    )
    
    Write-Host "`n--- $TestName ---" -ForegroundColor Yellow
    Write-Host "Query: $Query`n" -ForegroundColor Gray
    
    $body = @{
        messages = @(
            @{
                role = "user"
                content = $Query
            }
        )
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8087/chat" -Method Post -Body $body -ContentType "application/json"
        
        Write-Host "Response:" -ForegroundColor Green
        Write-Host $response.response -ForegroundColor White
        Write-Host ""
        
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
    }
}

# Test 1: Pending Approvals
Test-ChatbotQuery -TestName "Test 1: Pending Approvals" -Query "Show me all pending user approvals"

# Test 2: All Doctors
Test-ChatbotQuery -TestName "Test 2: List All Doctors" -Query "List all doctors in the system"

# Test 3: All Patients  
Test-ChatbotQuery -TestName "Test 3: List All Patients" -Query "Show me all patients"

# Test 4: Search by Organ
Test-ChatbotQuery -TestName "Test 4: Search Patients by Organ" -Query "Find patients with heart related records"

# Test 5: General Question
Test-ChatbotQuery -TestName "Test 5: General Question" -Query "What is Health Atlas?"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Tests Complete!  " -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
