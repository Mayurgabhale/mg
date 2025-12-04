edit button is not work please chekc wht is the issue 
<button class="edit-device-btn" onclick="openEditForDeviceFromIP('${deviceIP}')"
  style="margin-left:8px; padding:6px 8px;">Edit</button>

GET http://localhost/api/devices/10.21.8.66 404 (Not Found)
openEditForDeviceFromIP @ script.js:1947
onclick @ index.html:1Understand this error
script.js:1965 Error: Device not found (404)
    at openEditForDeviceFromIP (script.js:1948:27)


statusContainer.appendChild(statusText);

                    // compute a nicer label for the device-type area
                    let deviceLabel;

                    if (deviceType === "dbdetails") {
                        // For DB Details: show the application if available, else fallback
                        deviceLabel = device.application || deviceType.toUpperCase();
                    } else if (deviceType.includes("pc")) {
                        deviceLabel = device.pc_name || device.hostname || "PC";
                    } else {
                        deviceLabel = deviceType.toUpperCase();
                    }

                    card.insertAdjacentHTML("beforeend", `
                        <button class="edit-device-btn" onclick="openEditForDeviceFromIP('${deviceIP}')"
  style="margin-left:8px; padding:6px 8px;">Edit</button>
  <h3 class="device-name" style="font-size:20px; font-weight:500; font-family: PP Right Grotesk; margin-bottom: 10px;">
      ${device.cameraname || device.controllername || device.archivername || device.servername || device.hostname || "Unknown Device"}
  </h3>

  <div class="card-content">
      <p class="device-type-label ${deviceType}" 
         style="font-size:17px;  font-family: Roboto; font-weight:100; margin-bottom: 10px; display:flex; justify-content:space-between; align-items:center;">
          
          <strong>
            <i class="${getDeviceIcon(deviceType)}" style="margin-right: 5px;"></i> 
            ${deviceLabel}
          </strong>
          
          ${deviceType.includes("camera")
                            ? `<button class="open-camera-btn"
        onclick="openCamera('${deviceIP}', '${(device.cameraname || device.controllername || "").replace(/'/g, "\\'")}', '${device.hyperlink || ""}')"
        title="Open Camera"
        style="border:none; cursor:pointer; font-weight:100; border-radius:50%; width:34px; height:34px; display:flex; justify-content:center; align-items:center;">
    <img src="images/cctv.png" alt="Logo" style="width:33px; height:33px;"/>
</button>`
            

// ================= MODAL SHOW/HIDE =================
function showDeviceModal(mode="add", deviceObj=null) {
    const modal = document.getElementById("device-modal");
    const title = document.getElementById("device-modal-title");
    const deleteBtn = document.getElementById("device-delete-btn");

    document.getElementById("device-form").reset();
    document.getElementById("door-reader-body").innerHTML = "";
    document.getElementById("device-old-ip").value = "";

    if(mode==="add"){
        title.textContent="Add Device";
        deleteBtn.style.display="none";
        document.getElementById("device-type").disabled=false;
    } else {
        title.textContent="Edit Device";
        deleteBtn.style.display="inline-block";
        document.getElementById("device-type").disabled=true;

        // Fill fields
        const name = deviceObj.cameraname || deviceObj.controllername || deviceObj.archivername || deviceObj.servername || deviceObj.hostname || "";
        document.getElementById("device-name").value = name;
        document.getElementById("device-ip").value = deviceObj.IP_address || deviceObj.ip_address || "";
        document.getElementById("device-location").value = deviceObj.Location || deviceObj.location || "";
        document.getElementById("device-city").value = deviceObj.City || deviceObj.city || "";
        document.getElementById("device-details").value = deviceObj.device_details || "";
        document.getElementById("device-hyperlink").value = deviceObj.hyperlink || "";
        document.getElementById("device-remark").value = deviceObj.remark || "";
        document.getElementById("device-person").value = deviceObj.person_name || "";
        document.getElementById("device-old-ip").value = deviceObj.IP_address || deviceObj.ip_address || "";

        // Controller doors
        if(deviceObj.Doors && Array.isArray(deviceObj.Doors)){
            document.getElementById("device-type").value = "controller";
            updateFormFields();
            deviceObj.Doors.forEach(d=>{
                addDoorRow(d.door || d.Door, d.reader || "");
            });
        }
    }

    modal.style.display="flex";
}

function hideDeviceModal(){ document.getElementById("device-modal").style.display="none"; }

// ================= TYPE BASED FIELD =================
function updateFormFields(){
    const type = document.getElementById("device-type").value;
    const doorSec = document.getElementById("door-reader-container");
    doorSec.style.display = (type==="controller") ? "block" : "none";
}

// ================= DOOR ROW =================
function addDoorRow(door="", reader=""){
    const tbody = document.getElementById("door-reader-body");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" class="door-input" value="${door}"></td>
        <td><input type="text" class="reader-input" value="${reader}"></td>
        <td><button type="button" class="remove-door-row">X</button></td>
    `;
    tbody.appendChild(row);
    row.querySelector(".remove-door-row").addEventListener("click", ()=>row.remove());
}
document.getElementById("add-door-row").addEventListener("click", ()=>addDoorRow());

// ================= TYPE → BACKEND MAP =================
function mapUITypeToBackend(type){
    switch(type){
        case "camera": return "cameras";
        case "controller": return "controllers";
        case "archiver": return "archivers";
        case "server": return "servers";
        case "pcdetails": return "pcDetails";
        case "DBDetails": return "DBDetails";
        default: return "cameras";
    }
}

function convertToBackendFields(type, body){
    const mapped = {...body};
    switch(type){
        case "cameras": mapped.cameraname=body.name; break;
        case "controllers": mapped.controllername=body.name; break;
        case "archivers": mapped.archivername=body.name; break;
        case "servers": mapped.servername=body.name; break;
        case "pcDetails": mapped.hostname=body.name; break;
        case "DBDetails": mapped.hostname=body.name; break;
    }
    delete mapped.name;
    return mapped;
}

// ================= SAVE ADD/EDIT =================
document.getElementById("device-form").addEventListener("submit", async function(ev){
    ev.preventDefault();
    const oldIp = document.getElementById("device-old-ip").value;
    const uiType = document.getElementById("device-type").value;
    const backendType = mapUITypeToBackend(uiType);

    let body = {
        name: document.getElementById("device-name").value,
        ip_address: document.getElementById("device-ip").value,
        location: document.getElementById("device-location").value,
        city: document.getElementById("device-city").value,
        device_details: document.getElementById("device-details").value,
        hyperlink: document.getElementById("device-hyperlink").value,
        remark: document.getElementById("device-remark").value,
        person_name: document.getElementById("device-person").value
    };

    body = convertToBackendFields(backendType, body);

    if(backendType==="controllers"){
        const doors=[];
        document.querySelectorAll("#door-reader-body tr").forEach(tr=>{
            doors.push({
                door: tr.querySelector(".door-input").value,
                reader: tr.querySelector(".reader-input").value
            });
        });
        body.Doors = doors;
    }

    try{
        if(!oldIp){
            await fetch("http://localhost/api/devices", {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({type:backendType, device:body})
            });
        } else {
            await fetch(`http://localhost/api/devices/${oldIp}`, {
                method:"PUT",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(body)
            });
        }
        alert("Saved!");
        hideDeviceModal();
    } catch(err){
        alert("Error saving device: "+err.message);
    }
});

// ================= OPEN EDIT BY IP OR HOSTNAME =================
async function openEditForDeviceFromIP(ipOrHost){
    try{
        const res = await fetch(`http://localhost/api/devices/${encodeURIComponent(ipOrHost)}`);
        if(!res.ok) throw new Error(`Device not found (${res.status})`);

        const deviceObj = await res.json();

        let type="";
        if(deviceObj.cameraname) type="camera";
        else if(deviceObj.controllername) type="controller";
        else if(deviceObj.archivername) type="archiver";
        else if(deviceObj.servername) type="server";
        else if(deviceObj.hostname && deviceObj.is_pc_details) type="pcdetails";
        else if(deviceObj.hostname && deviceObj.is_db_details) type="DBDetails";
        else type="camera";

        document.getElementById("device-type").value=type;
        showDeviceModal("edit", deviceObj);

    } catch(err){
        console.error(err);
        alert("Cannot load device details: "+err.message);
    }
}
