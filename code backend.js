<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Device Manager</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<button onclick="showDeviceModal()">+ Add Device</button>

<!-- Device Modal -->
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
        <option value="DBDetails">DB Details</option>
      </select>

      <label>Name*</label>
      <input id="device-name" type="text">

      <label>IP Address*</label>
      <input id="device-ip" type="text">

      <label>Location*</label>
      <input id="device-location" type="text">

      <label>City*</label>
      <input id="device-city" type="text">

      <label>Details</label>
      <input id="device-details" type="text">

      <label>Hyperlink</label>
      <input id="device-hyperlink" type="url">

      <label>Remark</label>
      <input id="device-remark" type="text">

      <label>Person Name*</label>
      <input id="device-person" type="text">

      <!-- Controller Doors -->
      <div id="door-reader-container" style="display:none;">
        <h4>Doors & Readers</h4>
        <table>
          <thead>
            <tr><th>Door</th><th>Reader</th><th>Action</th></tr>
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

<script src="script.js"></script>
</body>
</html>