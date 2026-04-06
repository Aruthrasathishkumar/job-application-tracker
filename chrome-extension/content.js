function extractLinkedIn() {
  // Try multiple selectors since LinkedIn changes their DOM frequently
  const companySelectors = [
    '.job-details-jobs-unified-top-card__company-name a',
    '.job-details-jobs-unified-top-card__company-name',
    '.topcard__org-name-link',
    '.topcard__flavor a',
    '[data-test-employer-name]',
    '.jobs-unified-top-card__company-name a',
    '.jobs-unified-top-card__company-name',
  ]

  const roleSelectors = [
    '.job-details-jobs-unified-top-card__job-title h1',
    '.job-details-jobs-unified-top-card__job-title',
    '.topcard__title',
    '.jobs-unified-top-card__job-title h1',
    '.jobs-unified-top-card__job-title',
    'h1.t-24',
    'h1',
  ]

  let company = ''
  let role = ''

  for (const sel of companySelectors) {
    const el = document.querySelector(sel)
    if (el && el.innerText.trim()) {
      company = el.innerText.trim()
      break
    }
  }

  for (const sel of roleSelectors) {
    const el = document.querySelector(sel)
    if (el && el.innerText.trim()) {
      role = el.innerText.trim()
      break
    }
  }

  // Fallback: try to get from page title
  if (!company || !role) {
    const title = document.title
    // LinkedIn title format: "Role at Company | LinkedIn"
    const match = title.match(/^(.+?) (?:at|@) (.+?) \|/)
    if (match) {
      if (!role) role = match[1].trim()
      if (!company) company = match[2].trim()
    }
  }

  return {
    company,
    role,
    jd_url: window.location.href,
    source: 'linkedin'
  }
}

function extractNaukri() {
  const company =
    document.querySelector('.jd-header-comp-name a')?.innerText?.trim() ||
    document.querySelector('.jd-header-comp-name')?.innerText?.trim() ||
    document.querySelector('[class*="comp-name"]')?.innerText?.trim() || ''

  const role =
    document.querySelector('.jd-header-title')?.innerText?.trim() ||
    document.querySelector('h1.jd-header-title')?.innerText?.trim() ||
    document.querySelector('[class*="jd-header-title"]')?.innerText?.trim() || ''

  return {
    company,
    role,
    jd_url: window.location.href,
    source: 'cold'
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getJobData') {
    const url = window.location.href
    let data = {}
    if (url.includes('linkedin.com')) {
      data = extractLinkedIn()
    } else if (url.includes('naukri.com')) {
      data = extractNaukri()
    }
    sendResponse(data)
  }
  return true
})