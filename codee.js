// In your SSE endpoint, replace the 1-second interval with smarter polling
let lastPollTime = Date.now();
const MIN_POLL_INTERVAL = 5000; // 5 seconds minimum between polls

const push = async () => {
  const now = Date.now();
  if (now - lastPollTime < MIN_POLL_INTERVAL) {
    return; // Skip if too soon
  }
  
  if (pushRunning) {
    return;
  }
  
  pushRunning = true;
  lastPollTime = now;
  
  try {
    // Your existing push logic here...
    const fresh = await fetchNewEvents(lastSeen);
    // ... rest of your code
    
  } catch (err) {
    console.error('[DENVER] Push error:', err);
    // Increase interval on errors
    MIN_POLL_INTERVAL = Math.min(MIN_POLL_INTERVAL * 2, 30000); // Max 30s
  } finally {
    pushRunning = false;
  }
};

// Start with 5-second interval instead of 1-second
const timer = setInterval(push, 5000);