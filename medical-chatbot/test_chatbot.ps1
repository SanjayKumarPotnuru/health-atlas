# Test Health Atlas Chatbot with Function Calling

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "Testing Health Atlas AI Chatbot" -ForegroundColor Cyan
Write-Host "==================================`n" -ForegroundColor Cyan

# Test 1: Get pending approvals
Write-Host "Test 1: Asking chatbot to show pending user approvals..." -ForegroundColor Yellow

$body = @{
    messages = @(
        @{
            role = "user"
            content = "Show me all pending user approvals"
        }
    )
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8087/chat" -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "`nChatbot Response:" -ForegroundColor Green
    Write-Host $response.response -ForegroundColor White
    Write-Host "`nModel Used: $($response.model)" -ForegroundColor Gray
    
} catch {
    Write-Host "`nError: $_" -ForegroundColor Red
}

Write-Host "`n==================================`n" -ForegroundColor Cyan
