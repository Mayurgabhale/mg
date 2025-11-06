how to add height for this img

.chat-fab {
      position: fixed;
      right: 22px;
      bottom: 22px;
      width: 64px;
      height: 64px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg,#4267B2,#00A4FF);
      box-shadow: 0 12px 36px rgba(2,6,23,0.22);
      color: #fff;
      font-weight: 800;
      cursor: pointer;
      z-index: 3000;
      border: none;
    }
    .chat-fab .meta-icon { font-size: 22px; display:flex; align-items:center; justify-content:center; }
    
    .chat-modal { position: fixed; right: 22px; bottom: 100px; width: 420px; max-width: calc(100% - 40px); margin-top: 100px; height: 560px; background: #fff; border-radius: 12px; box-shadow: 0 24px 60px rgba(2,6,23,0.4); z-index: 3001; display: flex; flex-direction: column; overflow: hidden; }
    .chat-modal .chat-header { background: linear-gradient(90deg,#0f172a,#2563eb); margin-top: 70px; color: #fff; padding: 12px; display:flex; align-items:center; gap:12px; }
    .chat-modal .chat-header .title { font-weight:700; font-size:14px; }


            {/* ===== CHAT FAB & CHAT MODAL: now INSIDE the component RETURN (no more stray JSX outside) ===== */}
            <button className="chat-fab" title="Ask Trend Details (Ask Me )" onClick={() => setChatOpen(true)} aria-label="Open chat">
               
              <span className="meta-icon"><img src="chat-bot.png" alt=""/></span>
            </button>
