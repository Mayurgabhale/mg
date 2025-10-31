<div class="header-right">
  <img src="wu-logo.png" alt="Western Union Logo" class="wu-logo" />
</div>


.header-right {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-right::before {
  content: "";
  position: absolute;
  width: 100px;
  height: 100px;
  background: #000;
  border-radius: 50%;
  top: 0;
  left: 0;
  z-index: 0;
}

.wu-logo {
  width: 60px;
  height: auto;
  z-index: 1;
  position: relative;
}
