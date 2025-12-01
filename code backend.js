<!-- Device Modal (Add / Edit) -->
<div id="device-modal" class="modal" style="display:none;">
  <div class="modal-content" style="max-width:700px; padding:20px; border-radius:8px;">
    <h3 id="device-modal-title">Add Device</h3>
    <form id="device-form">
      <input type="hidden" id="device-old-ip" value="" />
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
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

        <label style="grid-column:1 / -1;">
          Hyperlink
          <input id="device-hyperlink" type="url" />
        </label>

        <label style="grid-column:1 / -1;">
          Remark
          <input id="device-remark" type="text" />
        </label>

        <label style="grid-column:1 / -1;">
          Person name
          <input id="device-person" type="text" />
        </label>
      </div>

      <div style="margin-top:12px; display:flex; justify-content:space-between; gap:8px;">
        <div>
          <button type="submit" id="device-save-btn" style="padding:8px 14px;">Save</button>
          <button type="button" id="device-cancel" style="padding:8px 14px;">Cancel</button>
        </div>
        <div>
          <button type="button" id="device-delete-btn" style="padding:8px 14px; background:#ef4444; color:white; display:none;">
            Delete
          </button>
        </div>
      </div>
    </form>
  </div>
</div>