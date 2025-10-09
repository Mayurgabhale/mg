/* Fancy popup container */
.fancy-popup {
  background: #1c1c24;
  color: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  animation: popupFadeIn 0.25s ease-out;
  transform-origin: top right;
  position: relative;
  min-width: 280px;
}

/* Popup animation */
@keyframes popupFadeIn {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Popup header */
.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255, 221, 0, 0.3);
  padding-bottom: 6px;
}

/* Clock-style close button */
.fancy-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #ffdd00;
  background: transparent;
  color: #ffdd00;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}

.fancy-close:hover {
  background: #ffdd00;
  color: #1c1c24;
  transform: rotate(90deg);
}

/* Popup body */
.popup-body {
  font-size: 14px;
  line-height: 1.5;
}

.popup-list {
  margin: 5px 0 0 15px;
  padding: 0;
  list-style: disc;
}

.popup-list li {
  margin-bottom: 3px;
}