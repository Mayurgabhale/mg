.device-card {
    position: relative;
}

.edit-device-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    border: none;
    background: transparent;
    cursor: pointer;
}

.device-card:hover .edit-device-btn {
    opacity: 1;
}


..
card.insertAdjacentHTML("beforeend", `
    <button class="edit-device-btn"
        onclick="openEditForDeviceFromIP('${deviceIP}', '${detectTypeFromDeviceObj(device)}')">
        <i class="bi bi-pencil-square"></i>
    </button>
`);