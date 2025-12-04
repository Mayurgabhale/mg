can you see my comment code in this edit buttin is work

// ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️
/* ----- Device Add/Edit/Delete UI helpers ----- */
// function openAddDevice() {
//     showDeviceModal("add");
// }

// // show modal (mode = 'add' | 'edit'), deviceObj is optional for edit

// function showDeviceModal(mode = "add", deviceObj = null) {
//     const modal = document.getElementById("device-modal");
//     const title = document.getElementById("device-modal-title");
//     const deleteBtn = document.getElementById("device-delete-btn");
//     const oldIpInput = document.getElementById("device-old-ip");

//     document.getElementById("device-form").reset();
//     oldIpInput.value = "";

//     if (mode === "add") {
//         title.textContent = "Add New Device";
//         deleteBtn.style.display = "none";
//         document.getElementById("device-type").disabled = false;
//     } else {
//         title.textContent = "Edit Device";
//         deleteBtn.style.display = "inline-block";

//         document.getElementById("device-type").value = deviceObj._type_for_ui || deviceObj.type || "camera";
//         document.getElementById("device-name").value = deviceObj.name || deviceObj.cameraname || "";
//         document.getElementById("device-ip").value = deviceObj.ip_address || deviceObj.IP_address || "";
//         document.getElementById("device-location").value = deviceObj.location || deviceObj.Location || "";
//         document.getElementById("device-city").value = deviceObj.city || deviceObj.City || "";
//         document.getElementById("device-details").value = deviceObj.details || "";
//         document.getElementById("device-hyperlink").value = deviceObj.hyperlink || "";
//         document.getElementById("device-remark").value = deviceObj.remark || "";
//         document.getElementById("device-person").value = deviceObj.person_name || "";

//         oldIpInput.value = deviceObj.ip_address || deviceObj.IP_address;
//         document.getElementById("device-type").disabled = true;
//     }

//     modal.style.display = "block";
// }

// function hideDeviceModal() {
//     document.getElementById("device-modal").style.display = "none";
// }

// // hide modal


// // submit handler for add/edit

// document.getElementById("device-form").addEventListener("submit", async function (ev) {
//     ev.preventDefault();

//     const oldIp = document.getElementById("device-old-ip").value;
//     const type = document.getElementById("device-type").value;

//     const deviceBody = {
//         name: document.getElementById("device-name").value || null,
//         ip_address: document.getElementById("device-ip").value || null,
//         location: document.getElementById("device-location").value || null,
//         city: document.getElementById("device-city").value || null,
//         details: document.getElementById("device-details").value || null,
//         hyperlink: document.getElementById("device-hyperlink").value || null,
//         remark: document.getElementById("device-remark").value || null,
//         person_name: document.getElementById("device-person").value || null
//     };

//     try {
//         if (!oldIp) {
//             // ADD
//             const resp = await fetch("http://localhost/api/devices", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ type, device: deviceBody })
//             });

//             if (!resp.ok) throw new Error("Add failed");
//         } else {
//             // EDIT
//             const resp = await fetch(`http://localhost/api/devices/${encodeURIComponent(oldIp)}`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(deviceBody)
//             });

//             if (!resp.ok) throw new Error("Update failed");
//         }

//         hideDeviceModal();
//         await fetchData(currentRegion);
//         alert("Saved successfully!");

//     } catch (err) {
//         alert("Error: " + err.message);
//     }
// });



// // cancel & close
// document.getElementById("device-cancel").addEventListener("click", hideDeviceModal);

// // delete handler
// document.getElementById("device-delete-btn").addEventListener("click", async function () {
//     const oldIp = document.getElementById("device-old-ip").value;
//     if (!oldIp) return;

//     if (!confirm("Delete this device permanently?")) return;

//     try {
//         const resp = await fetch(`http://localhost/api/devices/${encodeURIComponent(oldIp)}`, {
//             method: "DELETE"
//         });

//         if (!resp.ok) throw new Error("Delete failed");

//         hideDeviceModal();
//         await fetchData(currentRegion);

//         alert("Deleted");

//     } catch (err) {
//         alert("Error: " + err.message);
//     }
// });


// /* ---------- helper to wire edit action to device cards ----------
//    Call openEditForDeviceFromIP(ip) when you want to open edit modal for a specific device.
//    For example: add an 'Edit' button on each device card that calls this with the data-ip attribute.
// */
// async function openEditForDeviceFromIP(ip) {
//     if (!latestDetails || !latestDetails.details) {
//         await fetchData(currentRegion);
//     }

//     let found = null;

//     for (const list of Object.values(latestDetails.details)) {
//         const m = (list || []).find(d => (d.ip_address || d.IP_address || "").trim() === ip);
//         if (m) { found = m; break; }
//     }

//     if (!found) {
//         alert("Device not found");
//         return;
//     }

//     found._type_for_ui = detectTypeFromDeviceObj(found);
//     showDeviceModal("edit", found);
// }

// function detectTypeFromDeviceObj(obj) {
//     if (obj.cameraname) return "camera";
//     if (obj.archivername) return "archiver";
//     if (obj.controllername) return "controller";
//     if (obj.servername) return "server";
//     if (obj.hostname) return "pcdetails";
//     return "camera";
// }


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
        let url = `http://localhost/api/devices?ip=${encodeURIComponent(ipOrHost)}`;
        const res = await fetch(url);
        if(!res.ok) throw new Error(`Device not found (${res.status})`);

        const deviceObj = await res.json();
        showDeviceModal("edit", deviceObj);
    } catch(err){
        console.error(err);
        alert("Cannot load device details: "+err.message);
    }
}
