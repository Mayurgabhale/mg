i am select   <option value="pcdetails">PC Details</option>
that time i want to disply in form 
this 
HostName
PC Name
IP Address
Location
City and 

function updateFormFields() {
    const type = document.getElementById("device-type").value;

    const nameField = document.getElementById("device-name").parentElement;
    const cameraFields = document.getElementById("camera-fields");
    const pcFields = document.getElementById("pc-fields");
    const doorSec = document.getElementById("door-reader-container");

    // RESET ALL
    nameField.style.display = "block";
    cameraFields.style.display = "none";
    pcFields.style.display = "none";
    doorSec.style.display = "none";

    // CAMERA
    if (type === "camera") {
        cameraFields.style.display = "block";
    }

    // CONTROLLER
    if (type === "controller") {
        doorSec.style.display = "block";
    }

    // PC DETAILS
    if (type === "pcdetails") {
        nameField.style.display = "none";      // hide Name*
        pcFields.style.display = "block";      // show Host Name + PC Name
        cameraFields.style.display = "none";   // hide camera fields
    }

    // DB DETAILS (same as PC, but no PC name)
    // if (type === "dbdetails") {
    //     nameField.style.display = "none";
    //     pcFields.style.display = "none";
    //     cameraFields.style.display = "none";
    // }
}



  <div id="device-modal" class="modal">
    <div class="modal-content">
      <h3 id="device-modal-title">Add Device</h3>
      <form id="device-form">
        <input type="hidden" id="device-old-ip">

        <label>Type*</label>
        <select id="device-type" required onchange="updateFormFields()">
          <option value="camera">Camera</option>
          <option value="archiver">Archiver</option>
          <option value="controller">Controller</option>
          <option value="server">Server</option>
          <option value="pcdetails">PC Details</option>
          <option value="dbdetails">DB Details</option>
        </select>

        <label>Name*</label>
        <input id="device-name" type="text" placeholder="e.g Device Name">

        <label>IP Address*</label>
        <input id="device-ip" type="text" placeholder="e.g 10.100.111.11">

        <label>Location*</label>
        <input id="device-location" type="text" placeholder="e.g APAC, EMEA, LACA, NAMER">

        <label>City*</label>
        <input id="device-city" type="text" placeholder="e.g Pune, Denver">

      
        <!-- CAMERA FIELDS ONLY -->
        <div id="camera-fields">
          <label>Details*</label>
          <input id="device-details" type="text" placeholder="e.g FLIR, Verkada">

          <label>Hyperlink</label>
          <input id="device-hyperlink" type="url" placeholder="e.g https://link">

          <label>Remark</label>
          <input id="device-remark" type="text" placeholder="e.g Not accessible">
        </div>

        <div id="pc-fields" style="display: none;">
          <label>Host Name*</label>
          <input id="Host-Name" type="text" placeholder="e.g ">
          <label>PC Name*</label>
          <input id="PC-Name" type="text" placeholder="e.g ">
        </div>



        <!-- Added By -->
        <div id="added-by-box" style="display:none;">
          <label>Added By</label>
          <input id="device-added-by" type="text" placeholder="Your Name">
        </div>

        <!-- Updated By -->
        <div id="updated-by-box" style="display:none;">
          <label>Updated By</label>
          <input id="device-updated-by" type="text">
        </div>

        <!-- Controller Doors -->
        <div id="door-reader-container" style="display:none;" class="door-reader">
          <h4>Doors & Readers</h4>
          <table>
            <thead>
              <tr>
                <th>Door</th>
                <th>Reader</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="door-reader-body"></tbody>
          </table>
          <button type="button" id="add-door-row">Add Door</button>
        </div>

        <div class="modal-footer">
          <button type="submit">Save</button>
          <button type="button" onclick="hideDeviceModal()">Cancel</button>
          <button type="button" id="device-delete-btn" style="display:none;">Delete</button>
        </div>
      </form>
    </div>
  </div>


