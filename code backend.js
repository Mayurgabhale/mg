required filds js
<div id="device-modal" class="modal">
    <div class="modal-content">
      <h3 id="device-modal-title">Add Device</h3>
      <form id="device-form">
        <input type="hidden" id="device-old-ip">

        <label>Type<span class="required">*</span></label>
        <select id="device-type" required onchange="updateFormFields()">
          <option value="camera">Camera</option>
          <option value="archiver">Archiver</option>
          <option value="controller">Controller</option>
          <option value="server">Server</option>
          <option value="pcdetails">PC Details</option>
          <option value="dbdetails">DB Details</option>
        </select>

        <span id="name-field">
          <label>Name<span class="required">*</span></label>
          <input id="device-name" type="text" placeholder="e.g Device Name">
        </span>


        <label>IP Address<span class="required">*</span></label>
        <input id="device-ip" type="text" placeholder="e.g 10.100.111.11">

        <div id="pc-fields" style="display:none;">
          <label>Host Name<span class="required">*</span></label>
          <input id="Host-Name" type="text" placeholder="e.g ">
          <label>PC Name<span class="required">*</span></label>
          <input id="PC-Name" type="text" placeholder="e.g ">
        </div>

        <div id="db-fields" style="display:none;">
          <label>Host Name<span class="required">*</span></label>
          <input id="db-hostname" type="text" placeholder="e.g SRVWUDEN0890v">

          <label>Application<span class="required">*</span></label>
          <input id="db-application" type="text" placeholder="e.g CCURE SAS App">

          <label>Windows Server<span class="required">*</span></label>
          <input id="db-windows-server" type="text" placeholder="e.g Windows Server 2019 Standard">
        </div>

        <label>Location<span class="required">*</span></label>
        <input id="device-location" type="text" placeholder="e.g APAC, EMEA, LACA, NAMER">

        <label>City<span class="required">*</span></label>
        <input id="device-city" type="text" placeholder="e.g Pune, Denver">


        <!-- CAMERA FIELDS ONLY -->
        <div id="camera-fields">
          <label>Details<span class="required">*</span></label>
          <input id="device-details" type="text" placeholder="e.g FLIR, Verkada">

          <label>Hyperlink</label>
          <input id="device-hyperlink" type="url" placeholder="e.g https://link">

          <label>Remark</label>
          <input id="device-remark" type="text" placeholder="e.g Not accessible">
        </div>





        <!-- Added By -->
        <div id="added-by-box" style="display:none;">
          <label>Added By<span class="required">*</span></label>
          <input id="device-added-by" type="text" placeholder="Your Name">
        </div>

        <!-- Updated By -->
        <div id="updated-by-box" style="display:none;">
          <label>Updated B<span class="required">*</span></label>
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
