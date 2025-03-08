// made by chatgpt with help of shrey (no seriously tho i gave this to chatgpt once and it completly nuked it im never doing that shit again why do people do that willingly)
// currently broken on firefox (randomisation is too intense on firefox)
(function() {
    
    function spoofCanvas2D(ctx) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const noiseIntensity = 100; // todo - allow to be changed by user
    
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i+1];
            const b = data[i+2]; 
            data[i] = Math.min(255, Math.max(0, r + (Math.random() * noiseIntensity - noiseIntensity / 2)));
            data[i+1] = Math.min(255, Math.max(0, g + (Math.random() * noiseIntensity - noiseIntensity / 2)));
            data[i+2] = Math.min(255, Math.max(0, b + (Math.random() * noiseIntensity - noiseIntensity / 2)));
        }
    
        ctx.putImageData(imageData, 0, 0);
    }
    

    function spoofCanvasWebGL(ctx) {
        const ogrPx = ctx.readPixels;
        function randomNoise() {
            const noiseIntensity = 1; 
            return Math.random() * noiseIntensity - noiseIntensity / 2;
        }
        ctx.readPixels = function(x, y, width, height, format, type, pixels) {
            ogrPx.call(this, x, y, width, height, format, type, pixels);
            if (pixels instanceof Uint8Array) {
                for (let i = 0; i < pixels.length; i += 4) {
                    for (let j = 0; j < 3; j++) {
                        pixels[i + j] = Math.min(255, Math.max(0, pixels[i + j] + randomNoise()));
                    }
                }
            }
        };
    }
    function hookGetContext() {
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
            value: function(type, attributes) {
                const ctx = originalGetContext.call(this, type, attributes);
                if (type === "2d") {
                    setTimeout(() => spoofCanvas2D(ctx), 100); 
                } else if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") {
                    spoofCanvasWebGL(ctx);
                }
                return ctx;
            },
            configurable: true
        });
    }
    // prolly a better way to do this but i could not be bothered
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", hookGetContext);
    } else {
        hookGetContext();
    }
})();
