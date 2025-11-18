

document.getElementById("toggle-main-btn").addEventListener("click", function () {
    const details = document.getElementById("details-section");
    const graph = document.getElementById("main-graph");

    if (details.style.display === "none") {
        details.style.display = "block";   // Show details
        graph.style.display = "none";      // Hide graph
    } else {
        details.style.display = "none";    // Hide details
        graph.style.display = "block";     // Show graph
    }
});



...
document.getElementById("toggle-main-btn").addEventListener("click", function () {
    const details = document.getElementById("details-section");
    const graph = document.getElementById("main-graph");

    // Show details
    details.style.display = "block";

    // Hide graph
    graph.style.display = "none";
});





 <section id="main-graph" style="background: black; color: white;">
        <h2>all graph</h2>
      </section>  
     this section is disply by default ok 

          <button class="nav-button" id="toggle-main-btn">
        <i class="fas fa-window-maximize"></i>Device Details
      </button>
         when i clikc on >Device Details  this buttin that time i want to disply this ="details-section and hide "main-graph ok 
<!-- Main Content -->
    <main id="content">
      <section id="details-section" class="details-section">
        <div class="details-header">
          <h2><i class="fas fa-microchip"></i> Device Details</h2>
          <input type="text" id="device-search" placeholder="🔍 Search by IP, Location, City..." />
        </div>

        <div id="device-details" class="device-grid">Loading...</div>
        <div id="details-container" class="device-grid"></div>
      </section>

      <section id="main-graph" style="background: black; color: white;">
        <h2>all graph</h2>
      </section>
    </main>


document.getElementById("toggle-main-btn").addEventListener("click",function(){
    const mainContent = document.getElementById("details-section");

   if (mainContent.style.display === "none") {
        mainContent.style.display = "block";   // Show
    } else {
        mainContent.style.display = "none";    // Hide
    }
})


/* ===== Main Content ===== */
#content {
  
  flex: 1;
  /* padding: 20px 30px; */
  padding: 10px 10px;
  overflow-y: auto;
}
#details-section{
  display: none;
}

