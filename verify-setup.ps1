# FashionB2B SaaS Setup Verification Script
# Run this script to verify your setup before starting the application

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FashionB2B SaaS Setup Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allChecksPassed = $true

# Check Node.js
Write-Host "[1/8] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js installed: $nodeVersion" -ForegroundColor Green
    
    $nodeMajor = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($nodeMajor -lt 18) {
        Write-Host "  ⚠ Warning: Node.js 18+ recommended (you have $nodeVersion)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    $allChecksPassed = $false
}

# Check npm
Write-Host "[2/8] Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "  ✓ npm installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ npm not found" -ForegroundColor Red
    $allChecksPassed = $false
}

# Check PostgreSQL
Write-Host "[3/8] Checking PostgreSQL..." -ForegroundColor Yellow
try {
    $pgVersion = psql --version
    Write-Host "  ✓ PostgreSQL installed: $pgVersion" -ForegroundColor Green
    
    # Check if PostgreSQL service is running
    $pgService = Get-Service -Name postgresql* -ErrorAction SilentlyContinue
    if ($pgService) {
        $running = $pgService | Where-Object { $_.Status -eq 'Running' }
        if ($running) {
            Write-Host "  ✓ PostgreSQL service is running" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ PostgreSQL service is not running. Start it with: Start-Service postgresql-x64-14" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "  ✗ PostgreSQL not found. Please install PostgreSQL 14+ from https://www.postgresql.org/download/" -ForegroundColor Red
    $allChecksPassed = $false
}

# Check Redis (optional)
Write-Host "[4/8] Checking Redis (optional)..." -ForegroundColor Yellow
try {
    $redisTest = redis-cli ping 2>&1
    if ($redisTest -match "PONG") {
        Write-Host "  ✓ Redis is running" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Redis not available (optional - app will work without it)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ⚠ Redis not available (optional - app will work without it)" -ForegroundColor Yellow
}

# Check if dependencies are installed
Write-Host "[5/8] Checking frontend dependencies..." -ForegroundColor Yellow
if (Test-Path "frontend\node_modules") {
    Write-Host "  ✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  ✗ Frontend dependencies not installed. Run: cd frontend && npm install" -ForegroundColor Red
    $allChecksPassed = $false
}

Write-Host "[6/8] Checking backend dependencies..." -ForegroundColor Yellow
if (Test-Path "backend\node_modules") {
    Write-Host "  ✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  ✗ Backend dependencies not installed. Run: cd backend && npm install" -ForegroundColor Red
    $allChecksPassed = $false
}

# Check environment files
Write-Host "[7/8] Checking environment files..." -ForegroundColor Yellow
if (Test-Path "backend\.env") {
    Write-Host "  ✓ Backend .env file exists" -ForegroundColor Green
    
    # Check for required variables
    $envContent = Get-Content "backend\.env" -Raw
    $requiredVars = @("DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD")
    $missingVars = @()
    
    foreach ($var in $requiredVars) {
        if ($envContent -notmatch "$var=") {
            $missingVars += $var
        }
    }
    
    if ($missingVars.Count -eq 0) {
        Write-Host "  ✓ Required environment variables present" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Missing environment variables: $($missingVars -join ', ')" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ✗ Backend .env file not found. Create it from the template in RUN_APP_GUIDE.md" -ForegroundColor Red
    $allChecksPassed = $false
}

if (Test-Path "frontend\.env") {
    Write-Host "  ✓ Frontend .env file exists" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Frontend .env file not found (optional, but recommended)" -ForegroundColor Yellow
}

# Check database
Write-Host "[8/8] Checking database..." -ForegroundColor Yellow
if (Test-Path "backend\.env") {
    $envContent = Get-Content "backend\.env" -Raw
    if ($envContent -match "DB_NAME=(\w+)") {
        $dbName = $matches[1]
        try {
            $dbCheck = psql -U postgres -lqt 2>&1 | Select-String $dbName
            if ($dbCheck) {
                Write-Host "  ✓ Database '$dbName' exists" -ForegroundColor Green
            } else {
                Write-Host "  ✗ Database '$dbName' does not exist. Create it with: psql -U postgres -c 'CREATE DATABASE $dbName;'" -ForegroundColor Red
                $allChecksPassed = $false
            }
        } catch {
            Write-Host "  ⚠ Could not verify database (this is OK if credentials are different)" -ForegroundColor Yellow
        }
    }
}

# Check upload directories
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
        Write-Host "  ✓ $dir exists" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ $dir missing (will be created automatically)" -ForegroundColor Yellow
        $missingDirs += $dir
    }
}

if ($missingDirs.Count -gt 0) {
    Write-Host ""
    Write-Host "Creating missing directories..." -ForegroundColor Yellow
    foreach ($dir in $missingDirs) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
        Write-Host "  ✓ Created $dir" -ForegroundColor Green
    }
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($allChecksPassed) {
    Write-Host "✓ All critical checks passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Run database migrations: cd backend && npm run migrate" -ForegroundColor White
    Write-Host "2. Start backend: cd backend && npm run dev" -ForegroundColor White
    Write-Host "3. Start frontend: cd frontend && npm run dev" -ForegroundColor White
    Write-Host "4. Open http://localhost:3000 in your browser" -ForegroundColor White
} else {
    Write-Host "✗ Some checks failed. Please fix the issues above before running the application." -ForegroundColor Red
    Write-Host ""
    Write-Host "See RUN_APP_GUIDE.md for detailed setup instructions." -ForegroundColor Yellow
}
Write-Host "========================================" -ForegroundColor Cyan

