// Add context menu items for each composition rule when the extension is installed
browser.runtime.onInstalled.addListener(() => {
	console.log("Extension installed");
    
    browser.contextMenus.create({
        id: "ruleOfThirds",
        title: "Rule of Thirds",
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "perspective",
        title: "Perspective",
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "diagonalMethod",
        title: "Diagonal Method",
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "harmoniousTriangles",
        title: "Harmonious Triangles",
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "goldenSections",
        title: "Golden Sections",
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "goldenSpiral",
        title: "Golden Spiral",
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "goldenSpiralSections",
        title: "Golden Spiral Sections",
        contexts: ["all"]
    });
});

// Handle context menu clicks for each composition rule
browser.contextMenus.onClicked.addListener((info, tab) => {
    const drawFunctions = {
        "ruleOfThirds": drawRuleOfThirds,
        "perspective": drawPerspective,
        "diagonalMethod": drawDiagonalMethod,
        "harmoniousTriangles": drawHarmoniousTriangles,
        "goldenSections": drawGoldenSections,
        "goldenSpiral": drawGoldenSpiral,
        "goldenSpiralSections": drawGoldenSpiralSections
    };

    if (drawFunctions[info.menuItemId]) {
        applyOverlay(tab.id, drawFunctions[info.menuItemId]);
    }
});


function applyOverlay(tabId, drawFunctionName) {
    browser.tabs.sendMessage(tabId, { action: drawFunctionName.name });
}


// Rule of Thirds Overlay
function drawRuleOfThirds() {
    const img = document.querySelector('img:hover');
    if (!img) return;
    
    const imgRect = img.getBoundingClientRect();
    const overlay = createOverlay(imgRect);

    const ctx = overlay.getContext('2d');
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.lineWidth = 2;

    // Draw Rule of Thirds lines
    const thirdsX = imgRect.width / 3;
    const thirdsY = imgRect.height / 3;

    for (let i = 1; i < 3; i++) {
        ctx.moveTo(i * thirdsX, 0);
        ctx.lineTo(i * thirdsX, imgRect.height);
        ctx.moveTo(0, i * thirdsY);
        ctx.lineTo(imgRect.width, i * thirdsY);
    }
    ctx.stroke();
}

// Perspective Lines Overlay
function drawPerspectiveLines() {
    const img = document.querySelector('img:hover');
    if (!img) return;

    const imgRect = img.getBoundingClientRect();
    const overlay = createOverlay(imgRect);

    const ctx = overlay.getContext('2d');
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
    ctx.lineWidth = 2;

    // Draw perspective lines (diagonal lines from corners to center)
    ctx.moveTo(0, 0);
    ctx.lineTo(imgRect.width, imgRect.height);

    ctx.moveTo(imgRect.width, 0);
    ctx.lineTo(0, imgRect.height);

    ctx.moveTo(imgRect.width / 2, 0);
    ctx.lineTo(imgRect.width / 2, imgRect.height);

    ctx.moveTo(0, imgRect.height / 2);
    ctx.lineTo(imgRect.width, imgRect.height / 2);

    ctx.stroke();
}

// Diagonal Method Overlay
function drawDiagonalMethod() {
    const img = document.querySelector('img:hover');
    if (!img) return;

    const imgRect = img.getBoundingClientRect();
    const overlay = createOverlay(imgRect);

    const ctx = overlay.getContext('2d');
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.8)';
    ctx.lineWidth = 2;

    // Draw diagonal method (corner to corner)
    ctx.moveTo(0, 0);
    ctx.lineTo(imgRect.width, imgRect.height);

    ctx.moveTo(imgRect.width, 0);
    ctx.lineTo(0, imgRect.height);

    ctx.stroke();
}

// Harmonious Triangles Overlay
function drawHarmoniousTriangles() {
    const img = document.querySelector('img:hover');
    if (!img) return;

    const imgRect = img.getBoundingClientRect();
    const overlay = createOverlay(imgRect);

    const ctx = overlay.getContext('2d');
    ctx.strokeStyle = 'rgba(255, 165, 0, 0.8)';
    ctx.lineWidth = 2;

    // Harmonious triangles (divide into two triangles)
    ctx.moveTo(0, imgRect.height);
    ctx.lineTo(imgRect.width, imgRect.height);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, imgRect.height);

    ctx.moveTo(0, 0);
    ctx.lineTo(imgRect.width, 0);
    ctx.lineTo(imgRect.width, imgRect.height);
    ctx.lineTo(0, 0);

    ctx.stroke();
}

// Golden Sections Overlay
function drawGoldenSections() {
    const img = document.querySelector('img:hover');
    if (!img) return;

    const imgRect = img.getBoundingClientRect();
    const overlay = createOverlay(imgRect);

    const ctx = overlay.getContext('2d');
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
    ctx.lineWidth = 2;

    const phi = 1.618; // Golden ratio

    const phiX = imgRect.width / phi;
    const phiY = imgRect.height / phi;

    // Vertical golden section
    ctx.moveTo(phiX, 0);
    ctx.lineTo(phiX, imgRect.height);

    // Horizontal golden section
    ctx.moveTo(0, phiY);
    ctx.lineTo(imgRect.width, phiY);

    ctx.stroke();
}

// Golden Spiral Overlay
function drawGoldenSpiral() {
    const img = document.querySelector('img:hover');
    if (!img) return;

    const imgRect = img.getBoundingClientRect();
    const overlay = createOverlay(imgRect);

    const ctx = overlay.getContext('2d');
    ctx.strokeStyle = 'rgba(255, 69, 0, 0.8)';
    ctx.lineWidth = 2;

    const phi = 1.618; // Golden ratio
    let x = 0, y = 0;
    let width = imgRect.width, height = imgRect.height;

    for (let i = 0; i < 4; i++) {
        ctx.moveTo(x, y);
        ctx.arc(x, y, Math.min(width, height), 0, Math.PI / 2, false);

        x += width / phi;
        y += height / phi;
        width /= phi;
        height /= phi;
    }

    ctx.stroke();
}

// Golden Spiral Sections Overlay
function drawGoldenSpiralSections() {
    const img = document.querySelector('img:hover');
    if (!img) return;

    const imgRect = img.getBoundingClientRect();
    const overlay = createOverlay(imgRect);

    const ctx = overlay.getContext('2d');
    ctx.strokeStyle = 'rgba(75, 0, 130, 0.8)';
    ctx.lineWidth = 2;

    // Similar to the Golden Spiral but with multiple sections
    drawGoldenSpiral();
}

// Helper function to create a transparent overlay canvas
function createOverlay(imgRect) {
    const overlay = document.createElement('canvas');
    overlay.width = imgRect.width;
    overlay.height = imgRect.height;
    overlay.style.position = 'absolute';
    overlay.style.top = `${imgRect.top + window.scrollY}px`;
    overlay.style.left = `${imgRect.left + window.scrollX}px`;
    overlay.style.pointerEvents = 'none'; // Non-interactive

    document.body.appendChild(overlay);
    return overlay;
}
