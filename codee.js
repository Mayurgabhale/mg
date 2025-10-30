<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Western Union TEC Hyderabad - Security Protocols</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;500;600&display=swap');
  
  :root {
    --primary: #0055A4;
    --secondary: #FFD200;
    --accent: #E63946;
    --dark: #1A1A2E;
    --light: #F8F9FA;
    --gray: #6C757D;
  }
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    background: linear-gradient(135deg, #1A1A2E 0%, #16213E 100%);
    margin: 0;
    padding: 40px 20px;
    font-family: 'Open Sans', sans-serif;
    color: var(--dark);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .poster {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
    border-radius: 20px;
    padding: 50px 60px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
    position: relative;
    overflow: hidden;
  }
  
  .poster::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 8px;
    background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid var(--primary);
    padding-bottom: 20px;
    margin-bottom: 30px;
    position: relative;
  }

  header .title {
    font-weight: bold;
  }

  header .title h1 {
    font-family: 'Montserrat', sans-serif;
    font-size: 42px;
    margin: 0;
    line-height: 1.1;
    color: var(--primary);
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  }

  header .title h2 {
    font-family: 'Montserrat', sans-serif;
    font-size: 24px;
    font-weight: 600;
    margin: 8px 0 0;
    color: var(--dark);
    letter-spacing: 1px;
  }

  .logo-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .logo {
    width: 120px;
    height: 120px;
    background: var(--primary);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 5px 15px rgba(0, 85, 164, 0.3);
    margin-bottom: 10px;
  }
  
  .logo i {
    font-size: 60px;
    color: var(--secondary);
  }
  
  .logo-text {
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 14px;
    color: var(--primary);
    text-align: center;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 35px;
    margin-bottom: 20px;
  }

  .section {
    margin-bottom: 25px;
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-left: 4px solid var(--primary);
  }
  
  .section:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  .section h3 {
    display: flex;
    align-items: center;
    font-family: 'Montserrat', sans-serif;
    font-size: 18px;
    margin-bottom: 15px;
    font-weight: 600;
    color: var(--primary);
  }

  .section h3 .icon-container {
    width: 40px;
    height: 40px;
    background: var(--primary);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 12px;
    flex-shrink: 0;
  }
  
  .section h3 i {
    color: white;
    font-size: 18px;
  }

  ul {
    margin: 0;
    padding-left: 25px;
    font-size: 15px;
    line-height: 1.6;
    color: var(--dark);
  }
  
  ul li {
    margin-bottom: 8px;
    position: relative;
  }
  
  ul li:before {
    content: "•";
    color: var(--primary);
    font-weight: bold;
    display: inline-block;
    width: 1em;
    margin-left: -1em;
  }
  
  ul ul {
    margin-top: 8px;
    margin-bottom: 8px;
  }
  
  b {
    color: var(--primary);
    font-weight: 600;
  }

  .emergency {
    background: linear-gradient(135deg, var(--accent) 0%, #C1121F 100%);
    color: white;
    border-radius: 12px;
    padding: 25px 30px;
    margin-top: 30px;
    box-shadow: 0 10px 20px rgba(230, 57, 70, 0.3);
    position: relative;
    overflow: hidden;
  }
  
  .emergency::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 120px;
    height: 120px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(30px, -30px);
  }

  .emergency h3 {
    display: flex;
    align-items: center;
    margin-top: 0;
    font-family: 'Montserrat', sans-serif;
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 15px;
  }
  
  .emergency h3 i {
    margin-right: 12px;
    font-size: 26px;
  }

  .emergency ul {
    padding-left: 20px;
    font-size: 15px;
    line-height: 1.6;
  }
  
  .emergency ul li {
    margin-bottom: 10px;
  }
  
  .emergency ul li:before {
    color: white;
  }

  footer {
    text-align: center;
    margin-top: 35px;
    font-size: 14px;
    color: var(--gray);
    padding-top: 20px;
    border-top: 1px solid #e9ecef;
    font-weight: 500;
  }
  
  @media (max-width: 900px) {
    .grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    
    .poster {
      padding: 30px;
    }
    
    header {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    header .title {
      margin-bottom: 20px;
    }
    
    header .title h1 {
      font-size: 36px;
    }
    
    header .title h2 {
      font-size: 20px;
    }
  }
  
  @media (max-width: 600px) {
    body {
      padding: 20px 10px;
    }
    
    .poster {
      padding: 25px 20px;
    }
    
    header .title h1 {
      font-size: 30px;
    }
    
    header .title h2 {
      font-size: 18px;
    }
    
    .section {
      padding: 20px;
    }
    
    .emergency {
      padding: 20px;
    }
  }
</style>
</head>
<body>
  <div class="poster">
    <header>
      <div class="title">
        <h1>Western Union<br>TEC Hyderabad</h1>
        <h2>SECURITY PROTOCOLS</h2>
      </div>
      <div class="logo-container">
        <div class="logo">
          <i class="fas fa-shield-alt"></i>
        </div>
        <div class="logo-text">GLOBAL SECURITY</div>
      </div>
    </header>

    <div class="grid">
      <div class="section">
        <h3>
          <span class="icon-container">
            <i class="fas fa-id-card"></i>
          </span>
          ACCESS & IDENTIFICATION
        </h3>
        <ul>
          <li>Always display your photo ID card on site.</li>
          <li>Use your access card at readers during entry and exit.</li>
          <li>Do not lend or borrow ID cards.</li>
          <li>No tailgating or proxy punching — Zero Tolerance Policy.</li>
          <li>Restricted area access requires approval via iPads ticket.</li>
        </ul>
      </div>

      <div class="section">
        <h3>
          <span class="icon-container">
            <i class="fas fa-comments"></i>
          </span>
          COMMUNICATION & VIOLATIONS
        </h3>
        <ul>
          <li>Respond to GSOC emails about access violations.</li>
          <li>Report lost cards immediately to GSOC.</li>
          <li>For access issues, email:<br>
          <b>GSOC-GlobalSecurityOperationCenter.SharedMailbox@westernunion.com</b></li>
        </ul>
      </div>

      <div class="section">
        <h3>
          <span class="icon-container">
            <i class="fas fa-building-shield"></i>
          </span>
          PREMISES SECURITY
        </h3>
        <ul>
          <li>Close doors properly to avoid triggering alarms.</li>
          <li>Visitors must register at reception and be escorted at all times.</li>
          <li>Report any suspicious behavior to on-site security immediately.</li>
        </ul>
      </div>

      <div class="section">
        <h3>
          <span class="icon-container">
            <i class="fas fa-clock"></i>
          </span>
          WORKING HOURS & LATE WORK PROTOCOL
        </h3>
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
        <h3>
          <span class="icon-container">
            <i class="fas fa-clipboard-check"></i>
          </span>
          END-OF-DAY CHECKLIST
        </h3>
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

    <footer>© Western Union TEC Hyderabad | Global Security Operations Team</footer>
  </div>
</body>
</html>