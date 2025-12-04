card.insertAdjacentHTML("beforeend", `
    <button class="edit-device-btn" 
        onclick="openEditForDeviceFromIP('${deviceIP}', '${detectTypeFromDeviceObj(device)}')"
        style="margin-left:8px; padding:6px 8px;">
        Edit
    </button>
`);