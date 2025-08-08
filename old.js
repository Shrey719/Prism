const IOPairs = {
  
} 
const TARGET_DOMAINS = [
  'google.com',
  'youtube.com',
  'doubleclick.net'
];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    tab.url.startsWith('http') &&
    shouldClean(tab.url)
  ) {
    cleanTrackingCookies(tab.url);
  }
});

function shouldClean(url) {
  try {
    const u = new URL(url);
    return TARGET_DOMAINS.some(domain => u.hostname.endsWith(domain));
  } catch {
    return false;
  }
}

function cleanTrackingCookies(tabUrl) {
  const targetCookies = ['PREF', 'CONSISTENCY', "DV", "CONSENT", "NID", "OTZ", "UULE", "IDE", "ANID", "AID","TAID", "FLC"];

  for (const name of targetCookies) {
    chrome.cookies.getAll({ name }, (cookies) => {
      for (const cookie of cookies) {   
        const url = buildUrl(cookie);
        if (!urlMatchesTarget(url)) continue;

        chrome.cookies.remove(
          { url, name: cookie.name, storeId: cookie.storeId },
          (details) => {
            if (details) {
              console.log(`[PRISM] Removed cookie ${name} at ${url} with contents: ${cookie.value}`);
            } else {
              console.warn(`[PRISM] Failed to remove ${name} at`, url);
            }
          }
        );
      }
    });
  }
}

function urlMatchesTarget(url) {
  try {
    const u = new URL(url);
    return TARGET_DOMAINS.some(domain => u.hostname.endsWith(domain));
  } catch {
    return false;
  }
}

function buildUrl(cookie) {
  const protocol = cookie.secure ? 'https://' : 'http://';
  const domain = cookie.domain.startsWith('.') ? cookie.domain.slice(1) : cookie.domain;
  return `${protocol}${domain}${cookie.path}`;
}
