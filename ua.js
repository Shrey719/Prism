let platforms = [
    "Linux",
    "Linux aarch64",
    "Linux armv5tejl",
    "Linux armv6l",
    "Linux armv7l",
    "Linux armv8l",
    "Linux i686",
    "Linux i686 on x86_64",
    "Win32",
    "OpenBSD amd64",
    "X11",
    "FreeBSD",
    "FreeBSD i386",
    "FreeBSD amd64"
];

function getPlatform() {
    return platforms[Math.floor(Math.random() * (platforms.length))]; // randrange (0, platforms.length) - exclusive
}
function injectScript(userAgent, platform) {
    const script = document.createElement("script");
    script.textContent = `
        (function() {
            Object.defineProperty(navigator, 'userAgent', {
                get: function() { return '${userAgent}'; },
                configurable: true
            });
            Object.defineProperty(navigator, 'appVersion', {
                get: function() { return '${userAgent}'; },
                configurable: true
            });
            Object.defineProperty(navigator, 'platform', {
                get: function() { return '${platform}'; },
                configurable: true
            });
        })();
    ;`
    document.documentElement.appendChild(script);
    script.remove();
}
chrome.runtime.sendMessage({ action: "getUserAgent" }, (response) => {
    if (response && response.userAgent) {
        injectScript(response.userAgent, getPlatform());
    } else {
        console.error("Couldnt get the user agent (idk why)");
    }
});

