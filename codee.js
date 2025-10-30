<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Western Union Security Protocols</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    background: #1a1a1a;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 10px;
  }
  
  .container {
    width: 100%;
    max-width: 700px;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
  
  .header {
    background: linear-gradient(135deg, #FFD200 0%, #FFC000 100%);
    padding: 20px 25px;
    color: #333;
    position: relative;
    overflow: hidden;
  }
  
  .header::before {
    content: '';
    position: absolute;
    top: -40px;
    right: -40px;
    width: 120px;
    height: 120px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
  }
  
  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2;
  }
  
  .title h1 {
    font-size: 28px;
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 4px;
  }
  
  .title h2 {
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 1px;
  }
  
  .logo {
    width: 60px;
    height: 60px;
    background: #0055A4;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  }
  
  .logo i {
    font-size: 28px;
    color: #FFD200;
  }
  
  .content {
    padding: 20px 25px;
    background: white;
  }
  
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 15px;
  }
  
  .section {
    background: #FFFDF0;
    border-radius: 6px;
    padding: 15px;
    border-left: 4px solid #FFD200;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }
  
  .section h3 {
    display: flex;
    align-items: center;
    font-size: 16px;
    margin-bottom: 10px;
    color: #333;
    font-weight: 600;
  }
  
  .section h3 i {
    width: 26px;
    height: 26px;
    background: #FFD200;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 8px;
    color: #333;
    font-size: 13px;
    flex-shrink: 0;
  }
  
  ul {
    margin: 0;
    padding-left: 18px;
    font-size: 14px;
    line-height: 1.4;
    color: #444;
  }
  
  ul li {
    margin-bottom: 5px;
  }
  
  b {
    color: #0055A4;
    font-weight: 600;
  }
  
  .emergency {
    background: linear-gradient(135deg, #E63946 0%, #C1121F 100%);
    color: white;
    border-radius: 6px;
    padding: 18px;
    margin-top: 10px;
    box-shadow: 0 3px 10px rgba(230, 57, 70, 0.3);
    position: relative;
    overflow: hidden;
  }
  
  .emergency::before {
    content: '';
    position: absolute;
    top: -15px;
    right: -15px;
    width: 70px;
    height: 70px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
  
  .emergency h3 {
    font-size: 17px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }
  
  .emergency h3 i {
    margin-right: 8px;
    font-size: 18px;
  }
  
  .emergency ul {
    color: white;
    padding-left: 16px;
    font-size: 14px;
  }
  
  .footer {
    text-align: center;
    padding: 12px;
    background: #f8f8f8;
    color: #666;
    font-size: 12px;
    font-weight: 500;
    border-top: 1px solid #eee;
  }

  /* Responsive adjustments */
  @media (max-width: 600px) {
    .grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
    
    .header {
      padding: 15px 20px;
    }
    
    .content {
      padding: 15px 20px;
    }
    
    .title h1 {
      font-size: 24px;
    }
    
    .title h2 {
      font-size: 16px;
    }
    
    .logo {
      width: 50px;
      height: 50px;
    }
    
    .logo i {
      font-size: 24px;
    }
  }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title-container">
        <div class="title">
          <h1>Western Union<br>TEC Hyderabad</h1>
          <h2>SECURITY PROTOCOLS</h2>
        </div>
        <div class="logo">
          <i class="fas fa-shield-alt"></i>
        </div>
      </div>
    </div>
    
    <div class="content">
      <div class="grid">
        <div class="section">
          <h3><i class="fas fa-id-card"></i>ACCESS & IDENTIFICATION</h3>
          <ul>
            <li>Always display your photo ID card on site.</li>
            <li>Use your access card at readers during entry and exit.</li>
            <li>Do not lend or borrow ID cards.</li>
            <li>No tailgating or proxy punching — Zero Tolerance Policy.</li>
            <li>Restricted area access requires approval via iPads ticket.</li>
          </ul>
        </div>

        <div class="section">
          <h3><i class="fas fa-comments"></i>COMMUNICATION & VIOLATIONS</h3>
          <ul>
            <li>Respond to GSOC emails about access violations.</li>
            <li>Report lost cards immediately to GSOC.</li>
            <li>For access issues, email:<br>
            <b>GSOC-GlobalSecurityOperationCenter.SharedMailbox@westernunion.com</b></li>
          </ul>
        </div>

        <div class="section">
          <h3><i class="fas fa-building-shield"></i>PREMISES SECURITY</h3>
          <ul>
            <li>Close doors properly to avoid triggering alarms.</li>
            <li>Visitors must register at reception and be escorted at all times.</li>
            <li>Report any suspicious behavior to on-site security immediately.</li>
          </ul>
        </div>

        <div class="section">
          <h3><i class="fas fa-clock"></i>WORKING HOURS & LATE WORK PROTOCOL</h3>
          <ul>
            <li><b>Office hours:</b> 8 AM – 8 PM daily.</li>
            <li>Female employees working after 8 PM must:
              <ul>
                <li>Obtain approval from Manager & HR.</li>
                <li>Inform Site Operations & Security.</li>
                <li>Book transport in advance.</li>
              </ul>
            </li>
          </ul>
        </div>

        <div class="section">
          <h3><i class="fas fa-clipboard-check"></i>END-OF-DAY CHECKLIST</h3>
          <ul>
            <li>Tidy your desk and secure sensitive materials.</li>
            <li>Lock drawers, cabinets, and expensive equipment.</li>
            <li>Secure laptops, phones, and personal belongings.</li>
          </ul>
        </div>
      </div>

      <div class="emergency">
        <h3><i class="fas fa-exclamation-triangle"></i> EMERGENCY CONTACTS</h3>
        <ul>
          <li>Nearest Security Personnel</li>
          <li>2nd Floor – Security Reception: <b>__________</b> (internal) / <b>+91 __________</b> (external)</li>
          <li>Sravya Uppuluri – __________</li>
          <li>GSOC – 7632394 (internal) / +91 20-67632394 (external)</li>
          <li>Lloyd Dass – +91 9158998853</li>
        </ul>
      </div>
    </div>
    
    <div class="footer">
      © Western Union TEC Hyderabad | Global Security Operations Team
    </div>
  </div>
</body>
</html>