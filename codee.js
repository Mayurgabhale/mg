not disply 
/* === Default (Desktop) === */
#region-title {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background-color: #000000;
  color: #ffdd00;
  border-bottom: 3px solid #ffdd00;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
  font-size: 35px;
  /* border-bottom: 1px solid #000000; */
  /* border-top: 1px solid #000000; */
  font-family: "PP Right Grotesk";
  font-weight: 600;

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
}

  const logoHTML = `
                    <span class="region-logo">
                       <a href="http://10.199.22.57:3014/">
            <img src="images/home-svgrepo-com.svg" alt="Home"
            style="height: 37px; width: auto; object-fit: contain;" />
        </a>
                    </span>
                    `;
 <div id="region-title" class="dashboard-header">

        <div class="region-logo">
            <a href="http://10.199.22.57:3014/">
                <img src="images/home-svgrepo-com.svg" alt="Home" />
            </a>
        </div>
    </div>
