<!-- ================= DEVICE ADD / EDIT MODAL ================= -->
<div id="device-modal" class="modal">
  <div class="modal-content">
    <h3 id="device-modal-title">Add Device</h3>

    <form id="device-form">
      <input type="hidden" id="device-old-ip" />

      <div class="form-grid">

        <!-- TYPE -->
        <label>
          Type <span class="req">*</span>
          <select id="device-type" required onchange="updateFormFields()">
            <option value="camera">camera</option>
            <option value="archiver">archiver</option>
            <option value="controller">controller</option>
            <option value="server">server</option>
            <option value="pcdetails">pcdetails</option>
            <option value="DBDetails">DBDetails</option>
          </select>
        </label>

        <!-- NAME -->
        <label>
          Name <span class="req">*</span>
          <input id="device-name" type="text" required />
        </label>

        <!-- IP ADDRESS -->
        <label>
          IP Address <span class="req">*</span>
          <input id="device-ip" type="text" required />
        </label>

        <!-- LOCATION -->
        <label>
          Location <span class="req">*</span>
          <input id="device-location" type="text" required />
        </label>

        <!-- CITY -->
        <label>
          City <span class="req">*</span>
          <input id="device-city" type="text" required />
        </label>

        <!-- DETAILS -->
        <label>
          Device Details
          <input id="device-details" type="text" />
        </label>

        <!-- HYPERLINK -->
        <label class="full">
          Hyperlink
          <input id="device-hyperlink" type="url" />
        </label>

        <!-- REMARK -->
        <label class="full">
          Remark
          <input id="device-remark" type="text" />
        </label>

        <!-- PERSON NAME -->
        <label class="full">
          Person Name <span class="req">*</span>
          <input id="device-person" type="text" required />
        </label>
      </div>

      <!-- ================= DOOR + READER (ONLY FOR CONTROLLER) ================= -->
      <div id="door-reader-container" class="full" style="display:none;">
        <h4>Doors & Readers</h4>

        <table id="door-reader-table" class="dr-table">
          <thead>
            <tr>
              <th>Door</th>
              <th>Reader</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="door-reader-body"></tbody>
        </table>

        <button type="button" id="add-door-row" class="add-btn">+ Add Door</button>
      </div>

      <!-- FOOTER -->
      <div class="modal-footer">
        <div>
          <button type="submit" id="device-save-btn">Save</button>
          <button type="button" id="device-cancel" onclick="hideDeviceModal()">Cancel</button>
        </div>

        <button type="button" id="device-delete-btn" style="display:none;">Delete</button>
      </div>
    </form>

  </div>
</div>