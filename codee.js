const logoHTML = `
  <span class="region-logo">
    <a href="http://10.199.22.57:3014/" class="tooltip">
      <i class="fa-solid fa-house"></i>
      <span class="tooltiptext">Dashboard Hub</span>
    </a>
  </span>
`


/* Base icon styling */
#region-title .region-logo a {
  color: white;
  font-size: 30px;
  text-decoration: none;
  position: relative;
}

/* Tooltip container */
.tooltip .tooltiptext {
  visibility: hidden;
  opacity: 0;
  width: 140px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 8px;
  padding: 6px;
  position: absolute;
  bottom: 125%; /* position above icon */
  left: 50%;
  transform: translateX(-50%);
  transition: opacity 0.3s;
  z-index: 10001;
  font-size: 14px;
}

/* Show tooltip on hover */
.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}