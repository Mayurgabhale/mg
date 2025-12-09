<div id="device-modal" class="modal">
  <div class="modal-content">

      <!-- your form stuff here -->
      <form id="device-form">
        ...
      </form>

      <div class="modal-footer">
          <button type="submit" id="device-save-btn">Save</button>
          <button type="button" onclick="hideDeviceModal()">Cancel</button>
          <button type="button" id="device-delete-btn" style="display:none;">Delete</button>
      </div>

      <!-- 🔥 NEW visible on-screen loader -->
      <div id="save-loader" class="screen-loader">Saving...</div>

  </div>
</div>