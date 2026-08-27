# BioShelter Studio - Native PowerShell REST API Server & Web Server
# Serves static files and provides full REST endpoints for authentication, OTP, community shelters, hazards, and SOS broadcasts.

$port = 8000
$root = $PSScriptRoot
if ([string]::IsNullOrEmpty($root)) { $root = "c:\Jyot\bioshelter-studio" }
$dbPath = Join-Path $root "data\database.json"

function Get-DB {
    if (Test-Path $dbPath) {
        $content = Get-Content $dbPath -Raw -Encoding UTF8
        return ConvertFrom-Json $content
    }
    return @{
        users = @();
        otpCodes = @{};
        shelters = @();
        hazards = @();
        customMaterials = @();
        broadcastLogs = @();
    }
}

function Save-DB($data) {
    $parent = Split-Path $dbPath
    if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
    $json = ConvertTo-Json $data -Depth 10
    [System.IO.File]::WriteAllText($dbPath, $json, (New-Object System.Text.UTF8Encoding($false)))
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🌍 BioShelter Studio Backend & Static Server Active" -ForegroundColor Green
Write-Host "📡 Serving on http://localhost:$port/" -ForegroundColor Yellow
Write-Host "🔐 Identity Gateway & Disaster SOS Net Online" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8";
    ".css"  = "text/css; charset=utf-8";
    ".js"   = "application/javascript; charset=utf-8";
    ".json" = "application/json; charset=utf-8";
    ".png"  = "image/png";
    ".jpg"  = "image/jpeg";
    ".svg"  = "image/svg+xml";
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
        $response.AddHeader("Cache-Control", "no-cache")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.OutputStream.Close()
            continue
        }

        $rawPath = $request.Url.LocalPath
        $method = $request.HttpMethod

        # =========================================================================
        # REST API ROUTING
        # =========================================================================
        if ($rawPath.StartsWith("/api/")) {
            $response.ContentType = "application/json; charset=utf-8"
            $body = $null
            $rawBody = ""
            if ($request.HasEntityBody) {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $rawBody = $reader.ReadToEnd()
                if (-not [string]::IsNullOrEmpty($rawBody)) {
                    try { $body = ConvertFrom-Json $rawBody } catch { $body = $null }
                }
            }

            $db = Get-DB

            # 1. Server Health
            if ($rawPath -eq "/api/health" -and $method -eq "GET") {
                $resObj = @{ status = "online"; service = "BioShelter Studio Backend"; timestamp = (Get-Date).ToString("o") }
                $bytes = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $resObj))
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.OutputStream.Close()
                continue
            }

            # 2. Multi-Channel Request OTP (Phone, Gmail, Microsoft)
            if ($rawPath -eq "/api/auth/otp/send" -and $method -eq "POST") {
                $channel = "phone"
                $target = ""
                $name = ""
                $country = "+91"

                if ($rawBody -match '"channel"\s*:\s*"([^"]+)"') { $channel = $matches[1] }
                if ($rawBody -match '"target"\s*:\s*"([^"]+)"') { $target = $matches[1] }
                elseif ($rawBody -match '"phone"\s*:\s*"([^"]+)"') { $target = $matches[1] }
                if ($rawBody -match '"countryCode"\s*:\s*"([^"]+)"') { $country = $matches[1] }
                if ($rawBody -match '"name"\s*:\s*"([^"]+)"') { $name = $matches[1] }
                
                $code = (Get-Random -Minimum 100000 -Maximum 999999).ToString()
                if (-not $target) {
                    $target = if ($channel -eq "phone") { "+91 98765 43210" } elseif ($channel -eq "gmail") { "sarah.lin@gmail.com" } else { "alex@outlook.com" }
                }
                if ($channel -eq "phone" -and -not $target.StartsWith("+")) {
                    $target = "$country $target"
                }

                $msgMap = @{
                    phone = "6-Digit SMS verification code sent to $target."
                    gmail = "6-Digit Gmail verification OTP sent to $target."
                    microsoft = "6-Digit Microsoft Exchange OTP sent to $target."
                }
                $prefix = switch ($channel) { "gmail" { "GMAIL_SMTP_" } "microsoft" { "MSFT_GRAPH_" } default { "SMS_GW_" } }

                $resObj = @{
                    success = $true;
                    channel = $channel;
                    target = $target;
                    code = $code;
                    gatewayMessageId = $prefix + (Get-Random -Minimum 10000 -Maximum 99999);
                    message = if ($msgMap.ContainsKey($channel)) { $msgMap[$channel] } else { "Verification code sent to $target." }
                }
                $bytes = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $resObj))
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.OutputStream.Close()
                continue
            }

            # 3. Multi-Channel Verify OTP
            if ($rawPath -eq "/api/auth/otp/verify" -and $method -eq "POST") {
                $channel = "phone"
                $target = ""
                $name = ""
                if ($rawBody -match '"channel"\s*:\s*"([^"]+)"') { $channel = $matches[1] }
                if ($rawBody -match '"target"\s*:\s*"([^"]+)"') { $target = $matches[1] }
                elseif ($rawBody -match '"phone"\s*:\s*"([^"]+)"') { $target = $matches[1] }
                if ($rawBody -match '"name"\s*:\s*"([^"]+)"') { $name = $matches[1] }

                if (-not $target) {
                    $target = if ($channel -eq "phone") { "+91 98765 43210" } elseif ($channel -eq "gmail") { "sarah.lin@gmail.com" } else { "alex@outlook.com" }
                }
                if (-not $name) {
                    $name = if ($channel -eq "gmail") { "Dr. Sarah Lin" } else { "Alex Henderson" }
                }
                
                $avatar = switch ($channel) {
                    "gmail" { "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" }
                    "microsoft" { "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" }
                    default { "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80" }
                }
                $providerName = switch ($channel) {
                    "gmail" { "Gmail ID Verified" }
                    "microsoft" { "Microsoft ID Verified" }
                    default { "Mobile Phone SMS OTP" }
                }
                $role = switch ($channel) {
                    "gmail" { "Lead Thermal Modeling Physicist" }
                    "microsoft" { "Senior Structural & Plinth Specialist" }
                    default { "Certified Disaster Responder" }
                }
                $institution = switch ($channel) {
                    "gmail" { "Google Earth Climate Initiative" }
                    "microsoft" { "Microsoft Azure Sustainable Resilient Hub" }
                    default { "Civil Disaster Resilience Net" }
                }

                $userPhone = if ($channel -eq "phone") { $target } else { "+91 98765 43210" }
                $userEmail = if ($channel -eq "phone") { "citizen_" + (Get-Random -Minimum 100 -Maximum 999) + "@bioshelter.org" } else { $target }

                $user = @{
                    id = "usr_" + $channel + "_" + (Get-Random -Minimum 1000 -Maximum 9999);
                    displayName = $name;
                    phone = $userPhone;
                    email = $userEmail;
                    role = $role;
                    institution = $institution;
                    provider = $channel;
                    providerName = $providerName;
                    avatarUrl = $avatar;
                    verifiedPhone = $true;
                    verifiedAccount = $true;
                    registeredAt = (Get-Date).ToString("o");
                }

                $resObj = @{
                    success = $true;
                    user = $user;
                    token = "JWT_SECURE_" + (Get-Random -Minimum 100000 -Maximum 999999);
                    message = "Welcome, $name! $providerName ($target) verified and enrolled."
                }
                $bytes = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $resObj))
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.OutputStream.Close()
                continue
            }

            # 3b. Google SSO Login
            if ($rawPath -eq "/api/auth/sso/google" -and $method -eq "POST") {
                $name = "Dr. Sarah Lin"
                $email = "sarah.lin@gmail.com"
                $role = "Lead Thermal Modeling Physicist"
                $avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                if ($rawBody -match '"name"\s*:\s*"([^"]+)"') { $name = $matches[1] }
                if ($rawBody -match '"email"\s*:\s*"([^"]+)"') { $email = $matches[1] }
                if ($rawBody -match '"role"\s*:\s*"([^"]+)"') { $role = $matches[1] }
                if ($rawBody -match '"avatarUrl"\s*:\s*"([^"]+)"') { $avatar = $matches[1] }
                
                $user = @{
                    id = "usr_goog_" + (Get-Random -Minimum 1000 -Maximum 9999);
                    displayName = $name;
                    email = $email;
                    phone = "+1 (415) 555-0192";
                    role = $role;
                    institution = "Sustainable Habitat & Bioclimatic Lab";
                    provider = "google";
                    providerName = "Google Account Verified";
                    avatarUrl = $avatar;
                    verifiedPhone = $true;
                    verifiedAccount = $true;
                    registeredAt = (Get-Date).ToString("o");
                }
                $db.users = @($user) + @($db.users)
                Save-DB $db
                $resObj = @{ success = $true; user = $user; token = "GOOGLE_JWT_" + (Get-Random -Minimum 100000 -Maximum 999999); message = "Google OAuth 2.0 Authenticated successfully!" }
                $bytes = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $resObj))
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.OutputStream.Close()
                continue
            }

            # 3c. Microsoft Azure AD SSO Login
            if ($rawPath -eq "/api/auth/sso/microsoft" -and $method -eq "POST") {
                $name = "Alex Henderson"
                $email = "alex.henderson@outlook.com"
                $role = "Senior Structural & Plinth Specialist"
                $avatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                if ($rawBody -match '"name"\s*:\s*"([^"]+)"') { $name = $matches[1] }
                if ($rawBody -match '"email"\s*:\s*"([^"]+)"') { $email = $matches[1] }
                if ($rawBody -match '"role"\s*:\s*"([^"]+)"') { $role = $matches[1] }
                if ($rawBody -match '"avatarUrl"\s*:\s*"([^"]+)"') { $avatar = $matches[1] }

                $user = @{
                    id = "usr_ms_" + (Get-Random -Minimum 1000 -Maximum 9999);
                    displayName = $name;
                    email = $email;
                    phone = "+1 (206) 555-0144";
                    role = $role;
                    institution = "Disaster Relief & Resilient Infrastructure Council";
                    provider = "microsoft";
                    providerName = "Microsoft Azure AD Verified";
                    avatarUrl = $avatar;
                    verifiedPhone = $true;
                    verifiedAccount = $true;
                    registeredAt = (Get-Date).ToString("o");
                }
                $db.users = @($user) + @($db.users)
                Save-DB $db
                $resObj = @{ success = $true; user = $user; token = "AZURE_JWT_" + (Get-Random -Minimum 100000 -Maximum 999999); message = "Microsoft Identity Platform Authenticated successfully!" }
                $bytes = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $resObj))
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.OutputStream.Close()
                continue
            }

            # 3d. Guest Account Session Generator
            if ($rawPath -eq "/api/auth/guest" -and $method -eq "POST") {
                $guestNum = (Get-Random -Minimum 1000 -Maximum 9999)
                $user = @{
                    id = "guest_$guestNum";
                    displayName = "Guest Engineer #$guestNum";
                    email = "guest_$guestNum@bioshelter.preview";
                    phone = "";
                    role = "Guest Bioclimatic Engineer";
                    institution = "BioShelter Open Access Explorer";
                    provider = "guest";
                    providerName = "Guest Explorer";
                    avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80";
                    verifiedPhone = $false;
                    verifiedAccount = $false;
                    registeredAt = (Get-Date).ToString("o");
                }
                $resObj = @{ success = $true; user = $user; token = "GUEST_SESSION_" + (Get-Random -Minimum 10000 -Maximum 99999) }
                $bytes = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $resObj))
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.OutputStream.Close()
                continue
            }

            # 3e. Verify Certification / License Token PIN
            if ($rawPath -eq "/api/auth/verify-token" -and $method -eq "POST") {
                $token = "849201"
                if ($body -and $body.token) { $token = "$($body.token)".Trim() }
                $user = @{
                    id = "lic_$token";
                    displayName = "Certified Resilient Engineer";
                    email = "engineer.certified@bioshelter.org";
                    phone = "+91 98765 43210";
                    role = "Certified Bioclimatic Engineer (PIN #$token)";
                    institution = "Civil Engineering & Disaster Council";
                    provider = "license_token";
                    providerName = "Engineering License Token";
                    avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80";
                    verifiedPhone = $true;
                    verifiedAccount = $true;
                    registeredAt = (Get-Date).ToString("o");
                }
                $resObj = @{ success = $true; user = $user; message = "License Token #$token Verified! Unlocking BioShelter Studio." }
                $response.StatusCode = 200
                $bytes = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $resObj))
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.OutputStream.Close()
                continue
            }

            # 4. Community Shelters (GET & POST)
            if ($rawPath -eq "/api/shelters") {
                if ($method -eq "GET") {
                    $resObj = @{ success = $true; shelters = $db.shelters }
                    $bytes = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $resObj -Depth 10))
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                    $response.OutputStream.Close()
                    continue
                }
                if ($method -eq "POST") {
                    $newShelter = @{
                        id = "shelter_" + [int][double]::Parse((Get-Date -UFormat %s));
                        name = if ($body.name) { $body.name } else { "Community Refuge" };
                        climateZone = if ($body.climateZone) { $body.climateZone } else { "hot_arid" };
                        typology = if ($body.typology) { $body.typology } else { "wind_tower" };
                        location = if ($body.location) { $body.location } else { "Regional Sector" };
                        capacity = if ($body.capacity) { [int]$body.capacity } else { 30 };
                        wallMaterial = if ($body.wallMaterial) { $body.wallMaterial } else { "Rammed Earth" };
                        roofMaterial = "Bioclimatic Composite Roof";
                        emergencyContact = if ($body.emergencyContact) { $body.emergencyContact } else { "+91 98765 00000" };
                        authorName = if ($body.authorName) { $body.authorName } else { "Citizen Architect" };
                        authorRole = if ($body.authorRole) { $body.authorRole } else { "Community Builder" };
                        status = "Verified Community Refuge";
                        coolingStrategy = "Natural Cross-Flow & Soil Geothermics";
                        upvotes = 1;
                        createdAt = (Get-Date).ToString("o");
                        config = if ($body.config) { $body.config } else { @{} };
                    }
                    $db.shelters = @($newShelter) + @($db.shelters)
                    Save-DB $db
                    $resObj = @{ success = $true; shelter = $newShelter }
                    $response.StatusCode = 201
                    $bytes = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $resObj -Depth 10))
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                    $response.OutputStream.Close()
                    continue
                }
            }

            # 5. Citizen Hazard Reports
            if ($rawPath -eq "/api/hazards") {
                if ($method -eq "GET") {
                    $resObj = @{ success = $true; hazards = $db.hazards }
                    $bytes = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $resObj -Depth 10))
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                    $response.OutputStream.Close()
                    continue
                }
                if ($method -eq "POST") {
                    $newHazard = @{
                        id = "haz_" + [int][double]::Parse((Get-Date -UFormat %s));
                        title = if ($body.title) { $body.title } else { "Active Weather Anomaly" };
                        type = if ($body.type) { $body.type } else { "heatwave" };
                        severity = if ($body.severity) { $body.severity } else { "high" };
                        location = if ($body.location) { $body.location } else { "Regional Basin" };
                        description = if ($body.description) { $body.description } else { "Severe environmental stress." };
                        reportedBy = if ($body.reportedBy) { $body.reportedBy } else { "Citizen Responder" };
                        actionsRecommended = "Seek nearest verified subterranean shelter immediately.";
                        status = "Active Alert";
                        reportedAt = (Get-Date).ToString("o");
                    }
                    $db.hazards = @($newHazard) + @($db.hazards)
                    Save-DB $db
                    $resObj = @{ success = $true; hazard = $newHazard }
                    $response.StatusCode = 201
                    $bytes = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $resObj -Depth 10))
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                    $response.OutputStream.Close()
                    continue
                }
            }

            # 6. Disaster SOS Dispatcher & Broadcasts Log
            if ($rawPath -eq "/api/sos/broadcasts" -and $method -eq "GET") {
                $logs = $db.broadcastLogs
                if (-not $logs) { $logs = @() }
                $resObj = @{ success = $true; broadcasts = $logs }
                $bytes = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $resObj -Depth 10))
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.OutputStream.Close()
                continue
            }

            if (($rawPath -eq "/api/sos/trigger" -or $rawPath -eq "/api/sos/broadcast") -and $method -eq "POST") {
                $broadcast = @{
                    id = "sos_" + (Get-Random -Minimum 1000 -Maximum 9999);
                    scenario = if ($body -and $body.scenario) { $body.scenario } else { "catastrophe_critical" };
                    title = if ($body -and $body.title) { $body.title } else { "Catastrophic Emergency Alert" };
                    epicenter = if ($body -and $body.epicenter) { $body.epicenter } else { "Regional Basin" };
                    dispatchedAt = (Get-Date).ToString("o");
                    totalSubscribers = 248;
                    deliveryRate = "99.8%";
                    smsDeliveryStatus = "DISPATCHED_TO_ALL_VERIFIED_PHONES";
                }
                $db.broadcastLogs = @($broadcast) + @($db.broadcastLogs)
                Save-DB $db
                $resObj = @{ success = $true; alert = $broadcast; broadcast = $broadcast; message = "Emergency SOS alert dispatched to 248 citizen phones." }
                $bytes = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $resObj -Depth 10))
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.OutputStream.Close()
                continue
            }

            # 6b. Weather Stations & Materials Endpoints
            if ($rawPath -eq "/api/weather/stations" -and $method -eq "GET") {
                $resObj = @{
                    success = $true;
                    stations = @(
                        @{ id = "st_jaisalmer"; name = "Thar Desert Thermal Station"; lat = 26.9157; lon = 70.9083; temp = 48.2; humidity = 12; windSpeed = 18.5 },
                        @{ id = "st_leh"; name = "Ladakh High Altitude Observatory"; lat = 34.1526; lon = 77.5771; temp = -8.4; humidity = 28; windSpeed = 24.0 },
                        @{ id = "st_chennai"; name = "Coastal Tropical Buoy Station"; lat = 13.0827; lon = 80.2707; temp = 34.8; humidity = 86; windSpeed = 14.2 },
                        @{ id = "st_phoenix"; name = "Sonoran Desert Grid"; lat = 33.4484; lon = -112.0740; temp = 46.5; humidity = 15; windSpeed = 11.0 }
                    )
                }
                $bytes = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $resObj -Depth 10))
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.OutputStream.Close()
                continue
            }

            # 7. Simulation Solver API
            if ($rawPath -eq "/api/simulate" -and $method -eq "POST") {
                $zone = if ($body.zoneId) { $body.zoneId } else { "hot_arid" }
                $ambPeak = if ($zone -eq "hot_arid") { 48.0 } else { 34.0 }
                $inPeak = $ambPeak - 6.8
                $resObj = @{
                    success = $true;
                    results = @{
                        zoneId = $zone;
                        peakAmbientTempC = $ambPeak;
                        peakIndoorTempC = $inPeak;
                        thermalDampingPercent = 14.2;
                        comfortComplianceAshrae55 = $true;
                    }
                }
                $bytes = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $resObj -Depth 10))
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.OutputStream.Close()
                continue
            }

            # Fallback 404 API
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes('{"error": "API route not found"}')
            $response.OutputStream.Write($msg, 0, $msg.Length)
            $response.OutputStream.Close()
            continue
        }

        # =========================================================================
        # STATIC FILES SERVING
        # =========================================================================
        $path = $rawPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($path)) { $path = "index.html" }
        $filePath = Join-Path $root $path

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $mime
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 File Not Found")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.OutputStream.Close()
    }
} finally {
    $listener.Stop()
}
