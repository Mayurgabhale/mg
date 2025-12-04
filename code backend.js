in type i 
i selct camera then tabel form like that  input file and label name ok  
like all 
when i select type that time i want ot change my fomr filds ok 
so create like that  
cameraname 	Ip_address	Location	City	Deviec_details 	hyperlink	Remark
IN-PNQ-PF- Green Zone Workstations 10.199.10.12	10.199.10.12	APAC	Pune Podium	FLIR		
IN-PNQ-PF- Green Zone Workstations to Breakout Passage 10.199.10.140	10.199.10.140	APAC	Pune Podium	FLIR		

-------------
    controllername	IP_address	Location	City
IN-PUN-2NDFLR-ISTAR PRO	10.199.13.10	APAC	Pune 2nd Floor
IN-PUN-PODIUM-ISTAR PRO-01	10.199.8.20	APAC	Pune Podium

----------
    archivername	Ip_address	Location	City
Archiver Manila	10.193.132.8	APAC	Taguig City
Archiver Taguig City Philippines	10.194.2.190	APAC	Taguig City


---------
    servername 	IP_address	Location	City
Master Server 	10.58.118.20	NAMER	Denver Colorado


------------
    HostName	Ip_address	Location	City	PC Name
WKSWUPUN4501	WKSWUPUN4501	APAC	Pune Podium	Screen 03
WKSPUN-392353	WKSPUN-392353	APAC	Pune Podium	Screen 04


--------------
    Location	City	HostName	Ip_address	Application	Windows Server
NAMER	Denver	SRVWUDEN0890v	10.58.118.22	CCURE MAS SQL DB	Windows Server 2019 Standard
NAMER	Denver	SRVWUDEN0190V	10.58.118.20	CCURE MAS APP	Windows Server 2016 Standard


------
controllername	IP_address	Door 	reader	
IN-PUN-2NDFLR-ISTAR PRO	10.199.13.10	APAC_IN_PUN_2NDFLR_IDF ROOM_10:05:86 Restricted Door	in:1	
		APAC_IN_PUN_2NDFLR_UPS/ELEC ROOM Restricted Door_10:05:FE	in:1	
		APAC_IN_PUN_2NDFLR_RECPTION TO WORKSTATION DOOR_10:05:4B	in:1	
		APAC_IN_PUN_2NDFLR_RECPTION TO WORKSTATION DOOR_10:05:4B	out:1	
		APAC_IN_PUN_2NDFLR_LIFTLOBBY TO RECEPTION EMTRY DOOR_10:05:74	in:1	
		APAC_IN_PUN_2NDFLR_LIFTLOBBY TO WORKSTATION DOOR_10:05:F0	                	



---
    
/* ----- Device Add/Edit/Delete UI helpers ----- */
function openAddDevice() {
    showDeviceModal("add");
}

// Map UI type → backend type
function mapUITypeToBackend(type) {
    switch (type) {
        case "camera": return "cameras";
        case "controller": return "controllers";
        case "archiver": return "archivers";
        case "server": return "servers";
        case "pcdetails": return "pcDetails";
        case "dbdetails": return "DBDetails";
        default: return "cameras";
    }
}

// Convert UI device fields → backend field names
function convertToBackendFields(type, body) {
    const mapped = { ...body };

    switch (type) {
        case "cameras":
            mapped.cameraname = body.name;
            break;
        case "controllers":
            mapped.controllername = body.name;
            break;
        case "archivers":
            mapped.archivername = body.name;
            break;
        case "servers":
            mapped.servername = body.name;
            break;
        case "pcDetails":
            mapped.hostname = body.name;
            break;
        case "DBDetails":
            mapped.hostname = body.name;
            break;
    }

    delete mapped.name;
    return mapped;
}

// show modal
function showDeviceModal(mode = "add", deviceObj = null) {
    const modal = document.getElementById("device-modal");
    const title = document.getElementById("device-modal-title");
    const deleteBtn = document.getElementById("device-delete-btn");
    const oldIpInput = document.getElementById("device-old-ip");

    document.getElementById("device-form").reset();
    oldIpInput.value = "";

    if (mode === "add") {
        title.textContent = "Add New Device";
        deleteBtn.style.display = "none";
        document.getElementById("device-type").disabled = false;
    } else {
        title.textContent = "Edit Device";
        deleteBtn.style.display = "inline-block";

        document.getElementById("device-type").value =
            deviceObj._type_for_ui || "camera";

        document.getElementById("device-name").value =
            deviceObj.cameraname ||
            deviceObj.controllername ||
            deviceObj.archivername ||
            deviceObj.servername ||
            deviceObj.hostname ||
            "";

        document.getElementById("device-ip").value =
            deviceObj.ip_address || deviceObj.IP_address || "";

        document.getElementById("device-location").value = deviceObj.location || "";
        document.getElementById("device-city").value = deviceObj.city || "";
        document.getElementById("device-details").value =
            deviceObj.device_details || "";
        document.getElementById("device-hyperlink").value =
            deviceObj.hyperlink || "";
        document.getElementById("device-remark").value = deviceObj.remark || "";
        document.getElementById("device-person").value = deviceObj.person_name || "";

        oldIpInput.value = deviceObj.ip_address || deviceObj.IP_address;
        document.getElementById("device-type").disabled = true;
    }

    modal.style.display = "block";
}

function hideDeviceModal() {
    document.getElementById("device-modal").style.display = "none";
}

// Submit Add/Edit
document.getElementById("device-form").addEventListener("submit", async function (ev) {
    ev.preventDefault();

    const oldIp = document.getElementById("device-old-ip").value;
    const uiType = document.getElementById("device-type").value;
    const backendType = mapUITypeToBackend(uiType);

    let body = {
        name: document.getElementById("device-name").value || null,
        ip_address: document.getElementById("device-ip").value || null,
        location: document.getElementById("device-location").value || null,
        city: document.getElementById("device-city").value || null,
        device_details: document.getElementById("device-details").value || null,
        hyperlink: document.getElementById("device-hyperlink").value || null,
        remark: document.getElementById("device-remark").value || null,
        person_name: document.getElementById("device-person").value || null
    };

    // convert name → correct backend field (cameraname, controllername, hostname...)
    body = convertToBackendFields(backendType, body);

    try {
        if (!oldIp) {
            // ADD
            const resp = await fetch("http://localhost/api/devices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: backendType, device: body })
            });
            if (!resp.ok) throw new Error("Add failed");
        } else {
            // EDIT
            const resp = await fetch(`http://localhost/api/devices/${encodeURIComponent(oldIp)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            if (!resp.ok) throw new Error("Update failed");
        }

        hideDeviceModal();
        await fetchData(currentRegion);
        alert("Saved successfully!");

    } catch (err) {
        alert("Error: " + err.message);
    }
});

// Delete Device
document.getElementById("device-delete-btn").addEventListener("click", async function () {
    const oldIp = document.getElementById("device-old-ip").value;
    if (!oldIp) return;

    if (!confirm("Delete this device permanently?")) return;

    try {
        const resp = await fetch(`http://localhost/api/devices/${encodeURIComponent(oldIp)}`, {
            method: "DELETE"
        });
        if (!resp.ok) throw new Error("Delete failed");

        hideDeviceModal();
        await fetchData(currentRegion);

        alert("Deleted");

    } catch (err) {
        alert("Error: " + err.message);
    }
});


// ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️


  <!-- Device Modal (Add / Edit) -->
  <div id="device-modal" class="modal">
    <div class="modal-content">
      <h3 id="device-modal-title">Add Device</h3>

      <form id="device-form">
        <input type="hidden" id="device-old-ip" />

        <div>
          <label>
            Type <span class="c-mark">*</span>
            <select id="device-type" required>
              <option value="camera">camera</option>
              <option value="archiver">archiver</option>
              <option value="controller">controller</option>
              <option value="server">server</option>
              <option value="pcdetails">pcdetails</option>
              <option value="DBDetails">DBDetails</option>
            </select>
          </label>

          <label>
            Name<span class="c-mark">*</span>
            <input id="device-name" type="text" />
          </label>

          <label>
            IP Address<span class="c-mark">*</span>
            <input id="device-ip" type="text" />
          </label>

          <label>
            Location<span class="c-mark">*</span>
            <input id="device-location" type="text" />
          </label>

          <label>
            City<span class="c-mark">*</span>
            <input id="device-city" type="text" />
          </label>

          <label>
            Details
            <input id="device-details" type="text" />
          </label>

          <label style="grid-column:1/-1;">
            Hyperlink
            <input id="device-hyperlink" type="url" />
          </label>

          <label style="grid-column:1/-1;">
            Remark
            <input id="device-remark" type="text" />
          </label>

          <label style="grid-column:1/-1;">
            Person name<span class="c-mark">*</span>
            <input id="device-person" type="text" />
          </label>
        </div>

        <div class="modal-footer">
          <div>
            <button type="submit" id="device-save-btn">Save</button>
            <button type="button" id="device-cancel">Cancel</button>
          </div>

          <button type="button" id="device-delete-btn" style="display: none;">
            Delete
          </button>
        </div>
      </form>
    </div>
  </div>
  <!-- ⬇️⬇️⬇️⬇️ -->
