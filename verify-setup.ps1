# FashionB2B SaaS Setup Verification Script (ASCII-safe)
# Windows PowerShell 5.1 compatible

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FashionB2B SaaS Setup Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allChecksPassed = $true

# [1/8] Node.js
Write-Host "[1/8] Checking Node.js..." -ForegroundColor Yellow
try {
  $nodeVersion = node --version
  Write-Host "  OK: Node.js installed: $nodeVersion" -ForegroundColor Green
  $nodeMajor = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
  if ($nodeMajor -lt 18) {
    Write-Host "  WARN: Node.js 18+ recommended (you have $nodeVersion)" -ForegroundColor Yellow
  }
} catch {
  Write-Host "  FAIL: Node.js not found. Install from https://nodejs.org/" -ForegroundColor Red
  $allChecksPassed = $false
}

# [2/8] npm
Write-Host "[2/8] Checking npm..." -ForegroundColor Yellow
try {
  $npmVersion = npm --version
  Write-Host "  OK: npm installed: $npmVersion" -ForegroundColor Green
} catch {
  Write-Host "  FAIL: npm not found" -ForegroundColor Red
  $allChecksPassed = $false
}

# [3/8] PostgreSQL
Write-Host "[3/8] Checking PostgreSQL..." -ForegroundColor Yellow
try {
  $pgVersion = psql --version
  Write-Host "  OK: PostgreSQL installed: $pgVersion" -ForegroundColor Green
  $pgService = Get-Service -Name postgresql* -ErrorAction SilentlyContinue
  if ($pgService) {
    $running = $pgService | Where-Object { $_.Status -eq 'Running' }
    if ($running) {
      Write-Host "  OK: PostgreSQL service is running" -ForegroundColor Green
    } else {
      Write-Host "  WARN: PostgreSQL service is not running. Start it via Services or: Start-Service <serviceName>" -ForegroundColor Yellow
    }
  }
} catch {
  Write-Host "  FAIL: PostgreSQL not found. Install from https://www.postgresql.org/download/" -ForegroundColor Red
  $allChecksPassed = $false
}

# [4/8] Redis (optional)
Write-Host "[4/8] Checking Redis (optional)..." -ForegroundColor Yellow
try {
  $redisTest = redis-cli ping 2>&1
  if ($redisTest -match "PONG") {
    Write-Host "  OK: Redis is running" -ForegroundColor Green
  } else {
    Write-Host "  INFO: Redis not available (optional)" -ForegroundColor Yellow
  }
} catch {
  Write-Host "  INFO: Redis not available (optional)" -ForegroundColor Yellow
}

# [5/8] Frontend dependencies
Write-Host "[5/8] Checking frontend dependencies..." -ForegroundColor Yellow
if (Test-Path "frontend\node_modules") {
  Write-Host "  OK: Frontend dependencies installed" -ForegroundColor Green
} else {
  Write-Host "  FAIL: Frontend dependencies missing. Run: cd frontend; npm install" -ForegroundColor Red
  $allChecksPassed = $false
}

# [6/8] Backend dependencies
Write-Host "[6/8] Checking backend dependencies..." -ForegroundColor Yellow
if (Test-Path "backend\node_modules") {
  Write-Host "  OK: Backend dependencies installed" -ForegroundColor Green
} else {
  Write-Host "  FAIL: Backend dependencies missing. Run: cd backend; npm install" -ForegroundColor Red
  $allChecksPassed = $false
}

# [7/8] Environment files
Write-Host "[7/8] Checking environment files..." -ForegroundColor Yellow
if (Test-Path "backend\.env") {
  Write-Host "  OK: Backend .env exists" -ForegroundColor Green
  $envContent = Get-Content "backend\.env" -Raw
  $requiredVars = @("DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD")
  $missingVars = @()
  foreach ($var in $requiredVars) {
    if ($envContent -notmatch ("(?m)^" + [regex]::Escape($var) + "=.*")) {
      $missingVars += $var
    }
  }
  if ($missingVars.Count -eq 0) {
    Write-Host "  OK: Required variables present" -ForegroundColor Green
  } else {
    Write-Host "  WARN: Missing variables: $($missingVars -join ', ')" -ForegroundColor Yellow
  }
} else {
  Write-Host "  FAIL: Backend .env not found. Create it (see RUN_APP_GUIDE.md)" -ForegroundColor Red
  $allChecksPassed = $false
}

if (Test-Path "frontend\.env") {
  Write-Host "  OK: Frontend .env exists" -ForegroundColor Green
} else {
  Write-Host "  INFO: Frontend .env not found (optional)" -ForegroundColor Yellow
}

# [8/8] Database existence
Write-Host "[8/8] Checking database..." -ForegroundColor Yellow
if (Test-Path "backend\.env") {
  $envContent = Get-Content "backend\.env" -Raw
  if ($envContent -match "DB_NAME=(\w+)") {
    $dbName = $matches[1]
    try {
      $dbCheck = psql -U postgres -lqt 2>&1 | Select-String $dbName
      if ($dbCheck) {
        Write-Host "  OK: Database '$dbName' exists" -ForegroundColor Green
      } else {
        Write-Host "  FAIL: Database '$dbName' not found. Create it: psql -U postgres -c \"CREATE DATABASE $dbName;\"" -ForegroundColor Red
        $allChecksPassed = $false
      }
    } catch {
      Write-Host "  INFO: Could not verify database (credentials/service may differ)" -ForegroundColor Yellow
    }
  }
}

# Upload directories
Write-Host ""
Write-Host "Checking upload directories..." -ForegroundColor Yellow
$uploadDirs = @(
  "backend\uploads\temp",
  "backend\public\uploads\images",
  "backend\public\uploads\videos",
  "backend\public\uploads\thumbnails"
)

$missingDirs = @()
foreach ($dir in $uploadDirs) {
  if (Test-Path $dir) {
    Write-Host "  OK: $dir exists" -ForegroundColor Green
  } else {
    Write-Host "  INFO: $dir missing (will create)" -ForegroundColor Yellow
    $missingDirs += $dir
  }
}

if ($missingDirs.Count -gt 0) {
  Write-Host ""
  Write-Host "Creating missing directories..." -ForegroundColor Yellow
  foreach ($dir in $missingDirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    Write-Host "  OK: Created $dir" -ForegroundColor Green
  }
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($allChecksPassed) {
  Write-Host "All critical checks passed." -ForegroundColor Green
  Write-Host ""
  Write-Host "Next steps:" -ForegroundColor Cyan
  Write-Host "1. Run migrations: cd backend; npm run migrate" -ForegroundColor White
  Write-Host "2. Start backend: cd backend; npm run dev" -ForegroundColor White
  Write-Host "3. Start frontend: cd frontend; npm run dev" -ForegroundColor White
  Write-Host "4. Open http://localhost:3000" -ForegroundColor White
} else {
  Write-Host "Some checks failed. Fix issues above before running the app." -ForegroundColor Red
  Write-Host "See RUN_APP_GUIDE.md for details." -ForegroundColor Yellow
}
Write-Host "========================================" -ForegroundColor Cyan
