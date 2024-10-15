let rightClickedImg = null;

// Track the image that was right-clicked
document.addEventListener('contextmenu', (event) => {
    if (event.target.tagName === 'IMG') {
        rightClickedImg = event.target;
        console.log("Right-clicked image:", rightClickedImg);
    }
});

// Listen for messages from the background script
browser.runtime.onMessage.addListener((message) => {
    const img = rightClickedImg; // Use the right-clicked image
    if (!img) {
        console.log("No right-clicked image found!");
        return;
    }

    const overlay = createOverlay(img.getBoundingClientRect());
    const ctx = overlay.getContext("2d");

    switch (message.action) {
        case "drawRuleOfThirds":
            drawRuleOfThirds(ctx, img.width, img.height);
            break;
        case "drawGoldenSpiral":
            drawGoldenSpiral(ctx, img.width, img.height);
            break;
        case "drawPerspective":
            drawPerspective(ctx, img.width, img.height);
            break;
        case "drawDiagonalMethod":
            drawDiagonalMethod(ctx, img.width, img.height);
            break;
        case "drawHarmoniousTriangles":
            drawHarmoniousTriangles(ctx, img.width, img.height);
            break;
        case "drawGoldenSections":
            drawGoldenSections(ctx, img.width, img.height);
            break;
        case "drawGoldenSpiralSections":
            drawGoldenSpiralSections(ctx, img.width, img.height);
            break;
        default:
            console.log("No valid drawing action specified.");
    }
});


function createOverlay(imgRect) {
    const overlay = document.createElement('canvas');
    overlay.width = imgRect.width;
    overlay.height = imgRect.height;
    overlay.style.position = 'absolute';
    overlay.style.top = `${imgRect.top + window.scrollY}px`;
    overlay.style.left = `${imgRect.left + window.scrollX}px`;
    overlay.style.pointerEvents = 'none'; // Makes overlay non-interactive

    document.body.appendChild(overlay);
    return overlay;
}

function drawRuleOfThirds(ctx, width, height) {
    ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
    ctx.lineWidth = 2;

    const thirdsX = width / 3;
    const thirdsY = height / 3;

    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(thirdsX, 0);
    ctx.lineTo(thirdsX, height);
    ctx.moveTo(thirdsX * 2, 0);
    ctx.lineTo(thirdsX * 2, height);
    // Horizontal lines
    ctx.moveTo(0, thirdsY);
    ctx.lineTo(width, thirdsY);
    ctx.moveTo(0, thirdsY * 2);
    ctx.lineTo(width, thirdsY * 2);
    ctx.stroke();
}

function drawGoldenSpiral(ctx, width, height) {
    const phi = 1.618;
    let x = 0, y = 0;
    let w = width, h = height;

    ctx.strokeStyle = 'rgba(255, 165, 0, 0.8)';
    ctx.lineWidth = 2;

    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(x, y, Math.min(w, h), 0, Math.PI / 2, false);
        x += w / phi;
        y += h / phi;
        w /= phi;
        h /= phi;
        ctx.stroke();
    }
}

function drawPerspective(ctx, width, height) {
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
    ctx.lineWidth = 2;

    // Draw perspective lines (diagonal lines from corners to center)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.moveTo(width, 0);
    ctx.lineTo(0, height);

    // Draw center cross
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);

    ctx.stroke();
}

function drawDiagonalMethod(ctx, width, height) {
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.8)';
    ctx.lineWidth = 2;

    // Draw diagonal lines corner to corner
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.moveTo(width, 0);
    ctx.lineTo(0, height);

    ctx.stroke();
}

function drawHarmoniousTriangles(ctx, width, height) {
    ctx.strokeStyle = 'rgba(255, 165, 0, 0.8)';
    ctx.lineWidth = 2;

    // Draw harmonious triangles
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(width, height);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, height);

    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, height);
    ctx.lineTo(0, 0);

    ctx.stroke();
}

function drawGoldenSections(ctx, width, height) {
    const phi = 1.618; // Golden ratio
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
    ctx.lineWidth = 2;

    const phiX = width / phi;
    const phiY = height / phi;

    // Vertical golden section
    ctx.beginPath();
    ctx.moveTo(phiX, 0);
    ctx.lineTo(phiX, height);

    // Horizontal golden section
    ctx.moveTo(0, phiY);
    ctx.lineTo(width, phiY);

    ctx.stroke();
}

function drawGoldenSpiralSections(ctx, width, height) {
    drawGoldenSpiral(ctx, width, height);
}