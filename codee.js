JSX element 'img' has no corresponding closing tag.javascript

            {/* ===== CHAT FAB & CHAT MODAL: now INSIDE the component RETURN (no more stray JSX outside) ===== */}
            <button className="chat-fab" title="Ask Trend Details (Ask Me )" onClick={() => setChatOpen(true)} aria-label="Open chat">
              
              <span className="meta-icon"><img src="" alt=""></span>
            </button>

            {chatOpen && (
              <div className="chat-modal" role="dialog" aria-modal="true" aria-label="Trend Chatbot">
                <div className="chat-header">
