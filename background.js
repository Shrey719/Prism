const domainHandler = {
  'youtube.com': handleYoutube,
  'google.com': handleGoogle,
  'doubleclick.net': handleDoubleClick,
};

const lastRunMap = new Map();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    const url = new URL(tab.url);
    const hostname = url.hostname.toLowerCase();

    // Find matching domain policy for hostname or any parent domain
    const matchedDomain = Object.keys(domainHandler).find(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );

    if (matchedDomain) {
      domainHandler[matchedDomain](url);
    }
  }
});

function deleteCookies(cookieNames, domainPattern) {
  for (const name of cookieNames) {
    chrome.cookies.getAll({ name }, (cookies) => {
      for (const cookie of cookies) {
        if (!cookie.domain.includes(domainPattern)) continue;

        const domain = cookie.domain.startsWith('.') ? cookie.domain.slice(1) : cookie.domain;
        const protocol = cookie.secure ? 'https://' : 'http://';
        const cookieUrl = `${protocol}${domain}${cookie.path}`;

        chrome.cookies.remove({ url: cookieUrl, name: cookie.name, storeId: cookie.storeId }, (details) => {
          if (details) {
            console.log(`Deleted cookie ${cookie.name} at ${cookieUrl}`);
          } else {
            console.warn(`Failed to delete cookie ${cookie.name} at ${cookieUrl}`);
          }
        });
      }
    });
  }
}

function handleYoutube() {
  const cookieNames = [
    'PREF', 'CONSENT', 'VISITOR_INFO1_LIVE', 'YSC', 'GPS', 'DV',
    'SAPISID', 'APISID', 'SIDCC', '1P_JAR'
  ];
  deleteCookies(cookieNames, 'youtube.com');
}

function handleDoubleClick() {
  const cookieNames = [
    'IDE', 'FLC', 'AID', 'TAID', 'RUL'
  ];
  deleteCookies(cookieNames, 'doubleclick.net');
}

function handleGoogle() {
  const cookieNames = [
    'PREF', 'CONSENT', 'DV', 'APISID', 'SAPISID', 'SIDCC', 'NID', '1P_JAR', 'ANID'
  ];
  deleteCookies(cookieNames, 'google.com');
}
