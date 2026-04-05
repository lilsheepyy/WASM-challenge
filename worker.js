// worker.js
self.onmessage = async (e) => {
    const { challengeStr, difficulty } = e.data;
    try {
        // Cache-busting for the Wasm binary
        const response = await fetch('challenge.wasm?v=' + Date.now());
        const buffer = await response.arrayBuffer();
        const { instance } = await WebAssembly.instantiate(buffer, {});

        const encoder = new TextEncoder();
        const bytes = encoder.encode(challengeStr);
        const memory = new Uint8Array(instance.exports.memory.buffer);
        memory.set(bytes);

        const start = performance.now();
        // solve(ptr, len, difficulty)
        const nonce = instance.exports.solve(0, bytes.length, difficulty);
        const time = (performance.now() - start).toFixed(2);

        self.postMessage({ type: 'result', nonce, time });
    } catch (err) {
        self.postMessage({ type: 'error', message: err.message });
    }
};
