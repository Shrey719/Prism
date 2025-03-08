// i think these are the most common UA's
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.3",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1.1 Safari/605.1.1",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.1",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.",
  "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 OPR/95.0.0."
  
];

let pageUserAgents = {};
function getRandomUA(tabId) {
  if (!pageUserAgents[tabId]) {
      pageUserAgents[tabId] = userAgents[Math.floor(Math.random() * userAgents.length)];
  }
  return pageUserAgents[tabId];
}
// why the FUCK does firefox use browser and chrome uses chrome 
// WHYYY 

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    const userAgent = getRandomUA(details.tabId);
    for (let i = 0; i < details.requestHeaders.length; ++i) {
      if (details.requestHeaders[i].name === 'User-Agent') {
        details.requestHeaders[i].value = userAgent;
        break;
      }
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders"]
);

chrome.tabs.onRemoved.addListener((tabId) => {
  delete pageUserAgents[tabId];
});
// that moment when most secure browsers disable serviceworkers ( kill me )
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getUserAgent") {
      sendResponse({ userAgent: getRandomUA(sender.tab.id) });
  }
});
