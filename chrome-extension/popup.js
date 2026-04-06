const API = 'http://127.0.0.1:8000'

document.addEventListener('DOMContentLoaded', async () => {
  const token = await getToken()

  if (!token) {
    document.getElementById('form-section').style.display = 'none'
    document.getElementById('login-required').style.display = 'block'
    return
  }

  // Auto-fill from current LinkedIn/Naukri page
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    if (!tabs[0]) return
    const url = tabs[0].url || ''
    const isJobPage = url.includes('linkedin.com/jobs') || url.includes('naukri.com')

    // Always fill JD URL
    document.getElementById('jd_url').value = url

    if (!isJobPage) return

    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: extractJobData,
        args: [url]
      })

      const data = results?.[0]?.result
      if (data) {
        if (data.company) document.getElementById('company').value = data.company
        if (data.role)    document.getElementById('role').value    = data.role
        if (data.source)  document.getElementById('source').value  = data.source
      }
    } catch (e) {
      console.log('Extraction failed:', e)
    }
  })
})

// Runs inside the LinkedIn page to extract job info
function extractJobData(url) {
  let company = ''
  let role = ''

  const title = document.title
  // LinkedIn title format: "Role | Company | LinkedIn"
  const parts = title.split('|').map(p => p.trim())

  if (parts.length >= 2) {
    role    = parts[0]  // "Software Engineer 4 - Ads CRM"
    company = parts[1]  // "Netflix"
    // Make sure we didn't accidentally grab "LinkedIn" as company
    if (company.toLowerCase() === 'linkedin') {
      company = parts[2] || ''
    }
  }

  // DOM fallback if title parsing fails
  if (!company) {
    const selectors = [
      '.job-details-jobs-unified-top-card__company-name a',
      '.job-details-jobs-unified-top-card__company-name',
      '.jobs-unified-top-card__company-name a',
      '.topcard__org-name-link',
    ]
    for (const sel of selectors) {
      const el = document.querySelector(sel)
      if (el?.innerText?.trim()) { company = el.innerText.trim(); break }
    }
  }

  if (!role) {
    const selectors = [
      '.job-details-jobs-unified-top-card__job-title h1',
      '.jobs-unified-top-card__job-title h1',
      'h1',
    ]
    for (const sel of selectors) {
      const el = document.querySelector(sel)
      if (el?.innerText?.trim()) { role = el.innerText.trim(); break }
    }
  }

  return {
    company: company.trim(),
    role: role.trim(),
    source: url.includes('linkedin') ? 'linkedin' : 'cold'
  }
}

async function getToken() {
  return new Promise(resolve => {
    chrome.storage.local.get(['job_tracker_token'], result => {
      resolve(result.job_tracker_token || null)
    })
  })
}

async function addJob() {
  const token = await getToken()
  if (!token) return

  const btn = document.getElementById('add-btn')
  btn.disabled = true
  btn.textContent = 'Adding...'

  const salaryMin      = document.getElementById('salary_min').value
  const salaryMax      = document.getElementById('salary_max').value
  const offerReceived  = document.getElementById('offer_received').value

  const payload = {
    company:        document.getElementById('company').value.trim(),
    role:           document.getElementById('role').value.trim(),
    status:         document.getElementById('status').value,
    source:         document.getElementById('source').value,
    jd_url:         document.getElementById('jd_url').value.trim() || null,
    notes:          document.getElementById('notes').value.trim() || null,
    salary_min:     salaryMin     ? parseInt(salaryMin)     : null,
    salary_max:     salaryMax     ? parseInt(salaryMax)     : null,
    offer_received: offerReceived ? parseInt(offerReceived) : null,
  }

  if (!payload.company || !payload.role) {
    showStatus('Company and role are required', 'error')
    btn.disabled = false
    btn.textContent = 'Add Job'
    return
  }

  try {
    const res = await fetch(`${API}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      showStatus('✓ Added successfully! Check your board.', 'success')
      setTimeout(() => window.close(), 1500)
    } else {
      const err = await res.json()
      showStatus(err.detail || 'Failed to add job', 'error')
      btn.disabled = false
      btn.textContent = 'Add Job'
    }
  } catch (e) {
    showStatus('Cannot reach backend. Is it running?', 'error')
    btn.disabled = false
    btn.textContent = 'Add Job'
  }
}

function showStatus(msg, type) {
  const el = document.getElementById('status-msg')
  el.textContent = msg
  el.className = `status-msg ${type}`
  el.style.display = 'block'
}