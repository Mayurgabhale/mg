/* pin base */
.city-marker .pin {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(0,0,0,0.35);
  color: #fff;
  font-size: 14px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  transition: transform 120ms ease, opacity 120ms ease;
}

/* default icon color */
.city-marker .pin i {
  color: #ffd; /* subtle default */
  transform-origin: center;
}

/* blinking behaviour */
.city-marker .pin.blink {
  animation: city-pin-blink 1.0s infinite ease-in-out;
}

/* change color when blinking (more visible) */
.city-marker .pin.blink i {
  color: #ff3b3b;     /* red when blinking */
  text-shadow: 0 0 6px rgba(255,59,59,0.9);
}

/* keyframes */
@keyframes city-pin-blink {
  0%   { opacity: 1; transform: scale(1); }
  50%  { opacity: 0.25; transform: scale(1.12); }
  100% { opacity: 1; transform: scale(1); }
}

/* optionally add severity styles (if you want) */
.city-marker .pin.blink-high i { color: #ff0000; }