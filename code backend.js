.device-saving-box {
    display: none;
    position: fixed;
    top: 22px;
    right: 22px;
    z-index: 99999;

    background: linear-gradient(135deg, #0a0f14, #131a20);
    border: 1px solid #00c2ff;
    color: #00e1ff;

    padding: 12px 20px;
    border-radius: 10px;

    font-size: 16px;
    font-weight: bold;
    text-shadow: 0 0 5px #00e1ff;

    box-shadow: 0 0 15px #00c2ff;
    display: flex;
    align-items: center;
    gap: 12px;

    animation: fadeSlideDown 0.3s ease-out;
}

/* glowing rotating ring (CCTV style) */
.saving-icon {
    width: 18px;
    height: 18px;
    border: 3px solid #00c2ff;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    box-shadow: 0 0 10px #00c2ff;
}

/* Animations */
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes fadeSlideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}



<div id="save-loader" class="device-saving-box">
    <div class="saving-icon"></div>
    <span>Saving...</span>
</div>