chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url.startsWith("http")) {
    const url = new URL(tab.url);
    handleCookies(url);
  }
});

function deleteCookies(cookieNames, pattern) {
  for (const name of cookieNames) {
    chrome.cookies.getAll({ name }, (cookies) => {
      for (const cookie of cookies) {
        if (!cookie.domain.includes(pattern)) {
          continue;
        }
        const domain = cookie.domain.startsWith(".")
          ? cookie.domain.slice(1)
          : cookie.domain;
        const protocol = cookie.secure ? "https://" : "http://";
        const cookieUrl = `${protocol}${domain}${cookie.path}`;
        chrome.cookies.remove(
          { url: cookieUrl, name: cookie.name, storeId: cookie.storeId },
          (details) => {
            if (details) {
              console.log(`[PRISM] Deleted ${cookie.name} at ${cookieUrl}`);
            } else {
              console.warn(
                `[PRISM] Failed to delete ${cookie.name} at ${cookieUrl}`,
              );
            }
          },
        );
      }
    });
  }
}

function handleCookies(url) {
  switch (url.hostname) {
    case "youtube.com":
    case "www.youtube.com":
    case "m.youtube.com":
      handleYoutube();
      break;
    case "google.com":
    case "www.google.com":
    case "accounts.google.com":
      handleGoogle();
      break;
  }
}

function handleYoutube() {
  const cookieNames = [
    "PREF",
    "CONSENT",
    "VISITOR_INFO1_LIVE",
    "CONSISTENCY",
    "YSC",
    "GPS",
    "DV",
    "LOGIN_INFO",
    "SID",
    "HSID",
    "SAPISID",
    "APISID",
    "SSID",
    "SIDCC",
    "__Secure-1PAPISID",
    "__Secure-3PAPISID",
    "__Secure-1PSID",
    "__Secure-3PSID",
  ];
  deleteCookies(cookieNames, "youtube");
}

function handleGoogle() {}
