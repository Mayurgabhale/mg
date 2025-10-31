<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Western Union Security Protocols</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            font-family: 'Montserrat', sans-serif;
            background: #ffd400;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        
        .poster {
            width: 850px;
            height: 1200px;
            background: #ffd400;
            color: #000;
            padding: 40px 60px;
            box-sizing: border-box;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            border-radius: 8px;
            position: relative;
            overflow: hidden;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            position: relative;
        }
        
        .header-left h1:first-child {
            font-size: 48px;
            margin-bottom: 5px;
        }
        
        .header-left h1:last-child {
            font-size: 42px;
            margin-top: 0;
        }
        
        .header-right {
            font-size: 52px;
            font-weight: 800;
            position: relative;
        }
        
        .header-right::before {
            content: "";
            position: absolute;
            width: 80px;
            height: 80px;
            background: #000;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 0;
        }
        
        .header-right span {
            color: #ffd400;
            position: relative;
            z-index: 1;
        }
        
        .subhead {
            font-size: 22px;
            letter-spacing: 3px;
            font-weight: 700;
            margin-top: 8px;
            background: #000;
            color: #ffd400;
            display: inline-block;
            padding: 8px 20px;
            border-radius: 4px;
        }
        
        hr {
            border: 0;
            border-top: 3px solid rgba(0,0,0,0.4);
            margin: 20px 0;
        }
        
        .content {
            display: flex;
            justify-content: space-between;
            gap: 40px;
        }
        
        .column {
            flex: 1;
        }
        
        h3 {
            font-size: 20px;
            margin-bottom: 8px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        h3 i {
            color: #000;
        }
        
        ul {
            margin: 0;
            padding-left: 20px;
            font-size: 16px;
            line-height: 1.4;
        }
        
        li {
            margin-bottom: 8px;
            position: relative;
        }
        
        p {
            margin: 6px 0;
            font-size: 16px;
        }
        
        .footer {
            text-align: center;
            font-size: 14px;
            color: rgba(0,0,0,0.6);
            margin-top: 20px;
            padding: 10px;
            border-top: 1px solid rgba(0,0,0,0.2);
        }
        
        .security-badge {
            position: absolute;
            bottom: 40px;
            right: 60px;
            width: 100px;
            height: 100px;
            background: #000;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffd400;
            font-size: 40px;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .highlight-box {
            background: rgba(0,0,0,0.1);
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
        }
    </style>
</head>
<body>
    <div class="poster">
        <div class="header">
            <div class="header-left">
                <h1>Western Union</h1>
                <h1>TEC Pune</h1>
                <div class="subhead">SECURITY PROTOCOLS</div>
            </div>
            <div class="header-right">
                <span>WU</span>
            </div>
        </div>
        
        <hr />
        
        <div class="content">
            <div class="column">
                <h3><i class="fas fa-id-card"></i> ACCESS & IDENTIFICATION</h3>
                <ul>
                    <li><i class="fas fa-id-badge"></i> Always display your photo ID card on site</li>
                    <li><i class="fas fa-key-card"></i> Use your access card at the reader during entry and exit</li>
                    <li><i class="fas fa-user-shield"></i> Do not share or borrow ID cards</li>
                    <li><i class="fas fa-ban"></i> Tailgating and proxy punching — Zero Tolerance Policy</li>
                </ul>
                
                <h3><i class="fas fa-building-shield"></i> PREMISES SECURITY</h3>
                <ul>
                    <li><i class="fas fa-door-closed"></i> Close doors properly to avoid triggering delay alarms</li>
                    <li><i class="fas fa-user-check"></i> Visitors must register at reception and be escorted at all times</li>
                </ul>
                
                <h3><i class="fas fa-clipboard-check"></i> END-OF-DAY CHECKLIST</h3>
                <ul>
                    <li><i class="fas fa-desk"></i> Tidy your desk and secure sensitive materials</li>
                    <li><i class="fas fa-lock"></i> Lock drawers, cabinets, and expensive equipment</li>
                </ul>
            </div>
            
            <div class="column">
                <h3><i class="fas fa-comments"></i> COMMUNICATION & VIOLATIONS</h3>
                <div class="highlight-box">
                    <p><i class="fas fa-envelope"></i> Respond to any GSOC emails regarding access violations</p>
                    <p><i class="fas fa-exclamation-triangle"></i> Report lost cards immediately to GSDC</p>
                    <p><i class="fas fa-inbox"></i> For access issues, email GSOC-GlobalSecurityOperationCenter SharedMailbox@westernunion.com</p>
                </div>
                
                <h3><i class="fas fa-clock"></i> WORKING HOURS & LATE WORK PROTOCOL</h3>
                <p><i class="fas fa-business-time"></i> Office hours: 8AM to 5PM daily</p>
                <p><i class="fas fa-female"></i> Female employees working after 8 PM:</p>
                <ul>
                    <li><i class="fas fa-user-tie"></i> Obtain approval from manager HR</li>
                    <li><i class="fas fa-bell"></i> Inform Site Operations and Security</li>
                    <li><i class="fas fa-car"></i> Book transport in advance</li>
                </ul>
                
                <h3><i class="fas fa-phone-alt"></i> EMERGENCY CONTACTS</h3>
                <div class="contact-item">
                    <i class="fas fa-shield-alt"></i>
                    <p>Nearest Security Personnel</p>
                </div>
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <p>GSOC - +7632384 (internal)</p>
                </div>
                <div class="contact-item">
                    <i class="fas fa-mobile-alt"></i>
                    <p>+9120 676334 (external)</p>
                </div>
                <div class="contact-item">
                    <i class="fas fa-user-secret"></i>
                    <p>Lloyd Dass: +919156998853</p>
                </div>
            </div>
        </div>
        
        <div class="security-badge">
            <i class="fas fa-shield-alt"></i>
        </div>
        
        <div class="footer">
            Western Union — TEC Pune • Security is everyone's responsibility
        </div>
    </div>
</body>
</html>