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
    Object.defineProperty(navigator, 'productSub', {
        get: function() { return ${20030107}; },
        configurable: true
    });
    Object.defineProperty(navigator, 'vendorSub', {
        get: function() { return ''; },
        configurable: true
    });
    Object.defineProperty(navigator, 'hardwareConcurrency', {
        get: function() { return ${16}; },
        configurable: true
    });
    Object.defineProperty(navigator, 'deviceMemory', {
        get: function() { return ${16}; },
        configurable: true
    });
})();
;