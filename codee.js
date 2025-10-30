<!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Western Union — TEC Pune Security Protocols (Poster)</title>
  <!-- Uses Google Fonts (fallbacks provided) -->
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    /* Poster canvas: A4 @ 300dpi -> 2480 x 3508 px. */
    :root{
      --w-yellow:#ffd400; /* bright yellow */
      --w-black:#0b0b0b;
      --max-width:2480px;
      --max-height:3508px;
      --gutter:110px;
      --column-gap:120px;
      --heading-font: 'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
    }/* Page reset */
html,body{height:100%;margin:0;background:linear-gradient(180deg,var(--w-yellow),var(--w-yellow));font-family:var(--heading-font);}

/* Poster viewport in the middle for previewing in browser */
.poster-wrap{
  width:calc(var(--max-width) * 0.6); /* scaled down for screen preview */
  max-width:100%;
  margin:28px auto;
  box-shadow:0 20px 60px rgba(0,0,0,0.25);
  transform-origin:center;
}

.poster{
  width:2480px;height:3508px; /* exact pixel dimensions for A4 @ 300dpi */
  background:var(--w-yellow);
  color:var(--w-black);
  box-sizing:border-box;padding:120px 110px 100px 110px; /* top/right/bottom/left */
  position:relative;overflow:hidden;
}

/* Top branding */
.brand{
  display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:36px;
}
.brand h1{font-size:170px;line-height:0.9;margin:0;font-weight:800;letter-spacing:-2px}
.brand .wu{
  font-weight:800;font-size:180px;letter-spacing:2px;margin-left:20px;
}

hr.sep{border:0;border-top:5px solid rgba(0,0,0,0.15);margin:28px 0 46px}

.title{font-size:84px;letter-spacing:6px;font-weight:700;margin-bottom:8px}

/* Two-column grid for content */
.content{
  display:grid;grid-template-columns:1fr 1fr;gap:var(--column-gap);
  align-items:start;
}

.section{margin-bottom:36px}
.section .section-head{display:flex;align-items:center;gap:28px;margin-bottom:18px}
.section .section-head svg{width:120px;height:120px}
.section h3{font-size:48px;margin:0;font-weight:700}
.bullet-list{font-size:40px;line-height:1.35;margin:6px 0 26px;padding-left:22px}
.bullet-list li{margin:14px 0}

/* Left column has stacked sections with icons in left margin */
.left-col .section{display:flex;gap:26px}
.left-col .section .icon-wrap{width:150px;flex:0 0 150px;display:flex;align-items:flex-start}
.left-col .section .body{flex:1}

/* Right column sections (communication, working hours, emergency) */
.right-col .section{margin-bottom:34px}

.small{font-size:36px}
.muted{opacity:0.95}

/* End-of-day & Emergency styling */
.end-day h3,.emergency h3{font-size:46px}

/* Footer note scale */
.footer{position:absolute;left:120px;right:110px;bottom:60px;text-align:center;font-size:28px;color:rgba(0,0,0,0.6)}

/* Print friendly: ensure exact physical size when printed. */
@media print{
  .poster-wrap{transform:none;width:100%;box-shadow:none}
  .poster{width:2480px;height:3508px;padding:90px}
  body,html{background:transparent}
}

/* Responsive scaling for smaller screens */
@media (max-width:1200px){
  .poster-wrap{width:100%}
  .brand h1{font-size:72px}
  .brand .wu{font-size:78px}
  .title{font-size:32px}
  .bullet-list{font-size:16px}
}

  </style>
</head>
<body>
  <div class="poster-wrap">
    <main class="poster" role="main" aria-label="Western Union TEC Pune Security Protocols poster">
      <header class="brand">
        <div>
          <h1>Western Union</h1>
          <div style="height:18px"></div>
          <h1 style="font-size:140px;margin-top:8px">TEC Pune</h1>
          <div class="title">SECURITY PROTOCOLS</div>
        </div>
        <div class="wu">WU</div>
      </header><hr class="sep" />

  <section class="content">
    <!-- LEFT COLUMN -->
    <div class="left-col">

      <div class="section">
        <div class="icon-wrap">
          <!-- ID card icon -->
          <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="2" y="8" width="60" height="48" rx="4" fill="#0b0b0b"/>
            <rect x="8" y="14" width="20" height="12" rx="2" fill="#ffd400"/>
            <circle cx="48" cy="22" r="8" fill="#ffd400"/>
            <rect x="42" y="34" width="18" height="4" rx="1" fill="#ffd400"/>
            <rect x="8" y="28" width="28" height="6" rx="1" fill="#ffd400"/>
          </svg>
        </div>
        <div class="body">
          <h3>ACCESS &amp; IDENTIFICATION</h3>
          <ul class="bullet-list">
            <li>Always display your photo ID card on site</li>
            <li>Use your access card at the reader during entry and exit</li>
            <li>Do not share or borrow ID cards</li>
            <li>Tailgating and proxy punching — Zero Tolerance Policy</li>
          </ul>
        </div>
      </div>

      <div class="section">
        <div class="icon-wrap">
          <!-- Lock icon -->
          <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="12" y="28" width="40" height="28" rx="4" fill="#0b0b0b"/>
            <rect x="24" y="10" width="16" height="22" rx="8" fill="#0b0b0b"/>
            <circle cx="32" cy="44" r="4" fill="#ffd400"/>
          </svg>
        </div>
        <div class="body">
          <h3>PREMISES SECURITY</h3>
          <ul class="bullet-list">
            <li>Close doors properly to avoid triggering delay alarms</li>
            <li>Visitors must register at reception and be escorted at all times</li>
          </ul>
        </div>
      </div>

      <div class="section">
        <div class="icon-wrap">
          <!-- Checklist icon -->
          <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="8" y="6" width="48" height="52" rx="4" fill="#0b0b0b"/>
            <rect x="18" y="18" width="28" height="4" rx="1" fill="#ffd400"/>
            <rect x="18" y="30" width="28" height="4" rx="1" fill="#ffd400"/>
            <rect x="18" y="42" width="18" height="4" rx="1" fill="#ffd400"/>
          </svg>
        </div>
        <div class="body">
          <h3>END-OF-DAY CHECKLIST</h3>
          <ul class="bullet-list">
            <li>Tidy your desk and secure sensitive materials</li>
            <li>Lock drawers, cabinets, and expensive equipment</li>
          </ul>
        </div>
      </div>

    </div>

    <!-- RIGHT COLUMN -->
    <div class="right-col">

      <div class="section">
        <div class="section-head">
          <!-- Mail icon -->
          <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="6" y="14" width="52" height="36" rx="4" fill="#0b0b0b"/>
            <path d="M8 16 L32 36 L56 16" fill="#ffd400"/>
          </svg>
          <div>
            <h3>COMMUNICATION &amp; VIOLATIONS</h3>
          </div>
        </div>
        <p class="small muted">Respond to any GSOC emails regarding access violations</p>
        <p class="small muted">Report lost cards immediately to GSDC</p>
        <p class="small muted">For access issues, email GSOC-GlobalSecurityOperationCenter SharedMailbox@westernunion.com</p>
      </div>

      <div class="section">
        <div class="section-head">
          <!-- Clock icon (small) -->
          <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="32" cy="32" r="22" fill="#0b0b0b"/>
            <rect x="30" y="18" width="4" height="16" fill="#ffd400"/>
            <rect x="34" y="34" width="12" height="4" transform="rotate(45 40 36)" fill="#ffd400"/>
          </svg>
          <div>
            <h3>WORKING HOURS &amp; LATE WORK PROTOCOL</h3>
          </div>
        </div>
        <p class="small">Office hours: 8AM to 5PM daily</p>
        <p class="small" style="margin-top:8px">Female employees working after 8 PM:</p>
        <ul class="bullet-list small">
          <li>Obtain approval from manager HR</li>
          <li>Inform Site Operations and Security</li>
          <li>Book transport in advance</li>
        </ul>
      </div>

      <div class="section emergency">
        <div class="section-head">
          <!-- Phone/Contact icon -->
          <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="10" y="14" width="44" height="36" rx="4" fill="#0b0b0b"/>
            <rect x="22" y="24" width="20" height="4" rx="2" fill="#ffd400"/>
            <rect x="22" y="32" width="16" height="4" rx="2" fill="#ffd400"/>
          </svg>
          <div>
            <h3>EMERGENCY CONTACTS</h3>
          </div>
        </div>
        <p class="small">1 Nearest Security Personnel</p>
        <p class="small">GSOC - +7632384 (internal)</p>
        <p class="small">+9120 676334 (external)</p>
        <p class="small">Lloyd Dass: +919156998853</p>
      </div>

    </div>

  </section>

  <div class="footer">Western Union — TEC Pune • Security is everyone’s responsibility</div>

</main>

  </div>
</body>
</html>