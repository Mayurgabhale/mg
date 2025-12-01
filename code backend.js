/* ====== Modal Background ====== */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.55);   /* dark overlay */
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(3px);
}

/* ====== Modal Box ====== */
.modal-content {
    width: 650px;
    background: white;
    padding: 25px 30px;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0,0,0,0.25);
    animation: popup 0.25s ease-out;
    max-height: 90vh;
    overflow-y: auto;
}

/* Popup animation */
@keyframes popup {
    from {
        transform: scale(0.85);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}

/* ====== Modal Title ====== */
#device-modal-title {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 18px;
}

/* ====== Form Grid ====== */
#device-form div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

/* Full-width row items */
#device-form label[style*="grid-column"] {
    grid-column: 1 / -1 !important;
}

/* ====== Labels & Inputs ====== */
#device-form label {
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

#device-form input,
#device-form select {
    width: 100%;
    margin-top: 4px;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 14px;
    transition: border 0.2s;
}

#device-form input:focus,
#device-form select:focus {
    border-color: #4f46e5;
    outline: none;
}

/* ====== Button Bar ====== */
.modal-footer {
    margin-top: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* ====== Buttons ====== */
button {
    padding: 10px 18px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
}

/* Save Button */
#device-save-btn {
    background: #4f46e5;
    color: white;
}

#device-save-btn:hover {
    background: #4338ca;
}

/* Cancel */
#device-cancel {
    background: #ddd;
}

#device-cancel:hover {
    background: #ccc;
}

/* Delete Button */
#device-delete-btn {
    background: #e11d48;
    color: white;
}

#device-delete-btn:hover {
    background: #be123c;
}

/* Scrollbar inside modal */
.modal-content::-webkit-scrollbar {
    width: 6px;
}
.modal-content::-webkit-scrollbar-thumb {
    background: #b3b3b3;
    border-radius: 5px;
}


...
<!-- Device Modal (Add / Edit) -->
<div id="device-modal" class="modal">
  <div class="modal-content">
    <h3 id="device-modal-title">Add Device</h3>

    <form id="device-form">
      <input type="hidden" id="device-old-ip" />

      <div>
        <label>
          Type
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
          Name
          <input id="device-name" type="text" />
        </label>

        <label>
          IP Address
          <input id="device-ip" type="text" />
        </label>

        <label>
          Location
          <input id="device-location" type="text" />
        </label>

        <label>
          City
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
          Person name
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