(function() {
    'use strict';

    // --- SETTINGS ---
    const OVERLAY_POS = { x: 30, y: 120 }; // Lower than keystrokes overlay
    const BOX_WIDTH = 120;
    const BOX_HEIGHT = 40;

    // --- STATE ---
    let cpsEnabled = false;
    let clicks = [];
    let lastCps = 0;

    // --- OVERLAY CREATION ---
    let overlay = document.createElement("div");
    overlay.id = "cps-overlay";
    overlay.style.position = "fixed";
    overlay.style.left = OVERLAY_POS.x + "px";
    overlay.style.top = OVERLAY_POS.y + "px";
    overlay.style.zIndex = 99999;
    overlay.style.pointerEvents = "none"; // Allow clicks to go through
    overlay.style.width = BOX_WIDTH + "px";
    overlay.style.height = BOX_HEIGHT + "px";
    overlay.style.display = "none";
    overlay.style.background = "rgba(34,34,34,0.85)";
    overlay.style.color = "#00FF88";
    overlay.style.fontWeight = "bold";
    overlay.style.fontSize = "26px";
    overlay.style.textAlign = "center";
    overlay.style.lineHeight = BOX_HEIGHT + "px";
    overlay.style.borderRadius = "12px";
    overlay.style.boxShadow = "0 0 8px #00FF88";
    document.body.appendChild(overlay);

    function updateOverlay() {
        if (!cpsEnabled) {
            overlay.style.display = "none";
            return;
        }
        overlay.style.display = "block";
        overlay.textContent = "CPS: " + lastCps;
    }

    function calcCPS() {
        const now = Date.now();
        clicks = clicks.filter(ts => now - ts < 1000);
        lastCps = clicks.length;
        updateOverlay();
    }

    // --- KEYBOARD HANDLER TO TOGGLE ---
    window.addEventListener('keydown', function(e) {
        if (e.code === "KeyL" && !e.repeat) {
            cpsEnabled = !cpsEnabled;
            updateOverlay();
        }
    });

    // --- MOUSE HANDLER FOR CPS ---
    window.addEventListener('mousedown', function(e) {
        if (!cpsEnabled) return;
        if (e.button === 0) { // Left mouse
            clicks.push(Date.now());
            calcCPS();
        }
    });

    // --- INTERVAL TO RECALC CPS ---
    setInterval(function() {
        if (!cpsEnabled) return;
        calcCPS();
    }, 100);

    // Optional: Info in console
    console.log("[Eaglercraft CPS Mod] Loaded! Press 'L' to toggle CPS overlay.");
})();
