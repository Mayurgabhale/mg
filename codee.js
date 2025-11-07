
Device Dashboard\images\home-svgrepo-com.svg
  i want to use this svg image in the header left side after clikc this image i want to opne this page on same page tab ok not different ok 
    http://10.199.22.57:3014/ thsi 
    <div id="region-title" class="dashboard-header">
  .......in header 
        <div class="region-logo">
     
        </div>
    </div>


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

#region-title img {
  height: 40px;
  object-fit: contain;
}

#region-title .region-logo {
  position: absolute;
  top: 10px;
  left: 60px;
}

#region-title .region-logo img {
  display: block;
}
