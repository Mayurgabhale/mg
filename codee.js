#region-title {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background-color: #000;
  color: #ffdd00;
  border-bottom: 3px solid #ffdd00;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 35px;
  font-family: "PP Right Grotesk";
  font-weight: 600;
  z-index: 1000;
}

#region-title .region-logo {
  position: absolute;
  top: 10px;
  left: 20px;
}

#region-title .region-logo img {
  height: 40px;
  width: auto;
  display: block;
  cursor: pointer;
}const logoHTML = `
    <span class="region-logo">
        <a href="http://10.199.22.57:3014/">
            <img src="images/home-svgrepo-com.svg" alt="Home"
            style="height: 37px; width: auto; object-fit: contain;" />
        </a>
    </span>
`;