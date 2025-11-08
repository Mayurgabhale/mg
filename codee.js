<!-- Enhanced Door Popup Modal -->
<div id="door-modal" style="  
  display:none;  
  position:fixed;  
  top:0; left:0;  
  width:100%; height:100%;  
  background:rgba(0,0,0,0.7);  
  backdrop-filter: blur(5px);
  z-index:1000;  
  justify-content:center;  
  align-items:center;  
  animation:fadeIn 0.3s ease;
">
<div style="  
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius:16px;  
  width:90%;
  max-width:650px;
  max-height:85%;  
  overflow-y:auto;  
  padding:0;
  box-shadow:0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
  position:relative;  
  border:1px solid rgba(255,255,255,0.2);
  font-family: 'Segoe UI', system-ui, sans-serif;
">
  <div style="
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding:20px 25px;
    border-radius:16px 16px 0 0;
    color:white;
    position:sticky;
    top:0;
    z-index:10;
  ">
    <span id="close-door-modal" style="  
      position:absolute;  
      top:20px; right:25px;  
      cursor:pointer;  
      font-size:28px;  
      font-weight:300;  
      transition:transform 0.2s;
      width:32px;
      height:32px;
      display:flex;
      align-items:center;
      justify-content:center;
      border-radius:50%;
      background:rgba(255,255,255,0.2);
    ">×</span>
    <h2 style="margin:0; font-size:1.5rem; font-weight:600;">Controller Details</h2>
  </div>
  <div id="door-modal-content" style="padding:25px;"></div>
</div>
</div>

<style>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.device-card {
  background: white;
  border-radius:12px;
  padding:20px;
  margin-bottom:15px;
  cursor:pointer;
  border:1px solid #e2e8f0;
  box-shadow:0 2px 10px rgba(0,0,0,0.04);
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation:slideUp 0.4s ease;
}

.device-card:hover {
  transform:translateY(-3px);
  box-shadow:0 8px 25px rgba(0,0,0,0.1);
  border-color:#667eea;
}

.status-badge {
  display:inline-flex;
  align-items:center;
  padding:4px 12px;
  border-radius:20px;
  font-size:0.85rem;
  font-weight:500;
  gap:6px;
}

.status-badge::before {
  content:'';
  width:8px;
  height:8px;
  border-radius:50%;
  display:inline-block;
}

.status-online {
  background:#f0f9ff;
  color:#0369a1;
  border:1px solid #bae6fd;
}

.status-online::before {
  background:#0ea5e9;
}

.status-offline {
  background:#fef2f2;
  color:#dc2626;
  border:1px solid #fecaca;
}

.status-offline::before {
  background:#ef4444;
}

.door-item {
  background:white;
  border:1px solid #e2e8f0;
  border-radius:12px;
  padding:18px;
  margin-bottom:12px;
  transition:all 0.2s ease;
  box-shadow:0 2px 8px rgba(0,0,0,0.03);
}

.door-item:hover {
  border-color:#c7d2fe;
  box-shadow:0 4px 12px rgba(0,0,0,0.08);
}

.loading-spinner {
  display:inline-block;
  width:20px;
  height:20px;
  border:2px solid #f3f3f3;
  border-top:2px solid #667eea;
  border-radius:50%;
  animation:spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>




