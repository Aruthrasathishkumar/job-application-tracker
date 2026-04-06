// Runs on localhost:5173 automatically
// Reads the token from the web app's localStorage
// Saves it to chrome.storage so the popup can access it

function syncToken() {
  const token = localStorage.getItem('token')
  if (token) {
    chrome.storage.local.set({ job_tracker_token: token })
  } else {
    chrome.storage.local.remove('job_tracker_token')
  }
}

// Sync immediately when page loads
syncToken()

// Also sync whenever localStorage changes (login/logout events)
window.addEventListener('storage', syncToken)

// Poll every 2 seconds to catch login without page reload
setInterval(syncToken, 2000)