(function() {
    'use strict';

    // --- SETTINGS ---
    const KEYS = [
        { name: "W", code: "KeyW" },
        { name: "A", code: "KeyA" },
        { name: "S", code: "KeyS" },
        { name: "D", code: "KeyD" },
        { name: "Space", code: "Space" }
    ];
    const OVERLAY_POS = { x: 30, y: 30 }; // Top-left corner
    const BOX_SIZE = 40;
    const BOX_MARGIN = 6;

    // --- STATE ---
    let keystrokesOn = false;
    let keyState = {};
    for (const k of KEYS) keyState[k.code] = false;

    // --- OVERLAY CREATION ---
    let overlay = document.createElement("div");
    overlay.id = "keystrokes-overlay";
    overlay.style.position = "fixed";
    overlay.style.left = OVERLAY_POS.x + "px";
    overlay.style.top = OVERLAY_POS.y + "px";
    overlay.style.zIndex = 99999;
    overlay.style.pointerEvents = "none"; // Allow clicks to go through
    document.body.appendChild(overlay);

    function drawOverlay() {
        if (!keystrokesOn) {
            overlay.style.display = "none";
            return;
        }
        overlay.style.display = "block";
        overlay.innerHTML = ""; // Clear previous

        // WASD in T shape, space below
        // [W]
        // [A][S][D]
        //    [Space]
        // Draw W
        let boxW = makeBox(KEYS[0], 1, 0);
        overlay.appendChild(boxW);
        // Draw ASD
        for (let i = 1; i <= 3; ++i) {
            let box = makeBox(KEYS[i], i-1, 1);
            overlay.appendChild(box);
        }
        // Draw Space
        let boxSpace = makeBox(KEYS[4], 1, 2, true);
        overlay.appendChild(boxSpace);
    }
    function makeBox(key, col, row, wide) {
        let box = document.createElement("div");
        box.textContent = key.name;
        box.style.position = "absolute";
        box.style.left = (col * (BOX_SIZE + BOX_MARGIN)) + "px";
        box.style.top = (row * (BOX_SIZE + BOX_MARGIN)) + "px";
        box.style.width = (wide ? BOX_SIZE*3 + BOX_MARGIN*2 : BOX_SIZE) + "px";
        box.style.height = BOX_SIZE + "px";
        box.style.lineHeight = BOX_SIZE + "px";
        box.style.textAlign = "center";
        box.style.fontWeight = "bold";
        box.style.background = keyState[key.code] ? "#00FF88" : "#222";
        box.style.color = keyState[key.code] ? "#111" : "#eee";
        box.style.border = "2px solid #444";
        box.style.borderRadius = "10px";
        box.style.transition = "background 0.1s, color 0.1s";
        box.style.fontSize = "20px";
        box.style.userSelect = "none";
        box.style.boxShadow = keyState[key.code] ? "0 0 8px #00FF88" : "none";
        return box;
    }

    // --- KEYBOARD HANDLERS ---
    window.addEventListener('keydown', function(e) {
        // Toggle overlay with K
        if (e.code === "KeyK" && !e.repeat) {
            keystrokesOn = !keystrokesOn;
            drawOverlay();
        }
        if (!keystrokesOn) return;
        if (keyState.hasOwnProperty(e.code)) {
            if (!keyState[e.code]) {
                keyState[e.code] = true;
                drawOverlay();
            }
        }
    });
    window.addEventListener('keyup', function(e) {
        if (!keystrokesOn) return;
        if (keyState.hasOwnProperty(e.code)) {
            if (keyState[e.code]) {
                keyState[e.code] = false;
                drawOverlay();
            }
        }
    });

    // --- INITIALIZE ---
    overlay.style.display = "none";
    // Allow overlay to redraw on page resize
    window.addEventListener('resize', drawOverlay);

    // Optional: Info in console
    console.log("[Eaglercraft Keystrokes Mod] Loaded! Press 'K' to toggle keystrokes overlay.");
})();
