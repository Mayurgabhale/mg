<!-- Door Popup Modal -->
<div id="door-modal" style="
  display:none;
  position:fixed;
  top:0; left:0;
  width:100%; height:100%;
  background:rgba(0,0,0,0.6);
  z-index:1000;
  justify-content:center;
  align-items:center;
">
  <div style="
    background:white;
    border-radius:10px;
    width:600px;
    max-height:80%;
    overflow-y:auto;
    padding:20px;
    box-shadow:0 0 20px rgba(0,0,0,0.3);
    position:relative;
  ">
    <span id="close-door-modal" style="
      position:absolute;
      top:10px; right:15px;
      cursor:pointer;
      font-size:20px;
      font-weight:bold;
    ">&times;</span>
    <div id="door-modal-content"></div>
  </div>
</div>