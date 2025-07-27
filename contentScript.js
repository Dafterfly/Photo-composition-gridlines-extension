// === Global ===
let rightClickedImg = null;

// === Event Listeners ===

// Track right-clicked image or background image
document.addEventListener('contextmenu', (event) => {
    if (event.target.tagName === 'IMG') {
        rightClickedImg = event.target;
    } else {
        const backgroundImage = window.getComputedStyle(event.target).backgroundImage;
        const match = backgroundImage?.match(/url\(["']?(.+?)["']?\)/);

        if (match && match[1]) {
            rightClickedImg = new Image();
            rightClickedImg.src = match[1];
            console.log("Background image URL found:", rightClickedImg.src);
        } else {
            rightClickedImg = event.target.querySelector('img');
        }
    }

    if (rightClickedImg?.src) {
        console.log("Image found for context menu:", rightClickedImg.src);
    } else {
        console.log("No image found in clicked element");
    }
});

// Window resize/scroll repositioning
window.addEventListener('resize', updateOverlayPosition);
window.addEventListener('scroll', updateOverlayPosition);

// === Overlay Utilities ===

// Create canvas overlay over an image
function createOverlay(img) {
    const { top, left, width, height } = img.getBoundingClientRect();
    const overlay = document.createElement('canvas');

    Object.assign(overlay, { width, height });
    Object.assign(overlay.style, {
        position: 'absolute',
        top: `${top + window.scrollY}px`,
        left: `${left + window.scrollX}px`,
        pointerEvents: 'none',
        zIndex: 9999
    });

    document.body.appendChild(overlay);
    console.log("Overlay added with dimensions:", width, height);
    return overlay;
}

// Create image-based overlay (e.g. spiral)
function createImageOverlay(img, src) {
    const overlayImg = document.createElement('img');

    Object.assign(overlayImg, {
        src: browser.runtime.getURL(src)
    });

    Object.assign(overlayImg.style, {
        position: 'absolute',
        top: '0px',
        left: '0px',
        width: `${img.offsetWidth}px`,
        height: `${img.offsetHeight}px`,
        pointerEvents: 'none',
        zIndex: 9999
    });

    overlayImg.classList.add('spiral-overlay');
    img.parentElement.appendChild(overlayImg);
    return overlayImg;
}

// Update overlay position on scroll/resize
function updateOverlayPosition() {
    if (!rightClickedImg) return;

    const { top, left } = rightClickedImg.getBoundingClientRect();
    const position = {
        top: `${top + window.scrollY}px`,
        left: `${left + window.scrollX}px`
    };

    document.querySelectorAll('canvas, img.spiral-overlay').forEach(el => {
        el.style.top = position.top;
        el.style.left = position.left;
    });

    console.log("Overlay position updated:", position.top, position.left);
}

// === Drawing Rules ===

function ruleOfThirds(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.lineWidth = 2;

    [1, 2].forEach(i => {
        ctx.beginPath();
        ctx.moveTo((w / 3) * i, 0);
        ctx.lineTo((w / 3) * i, h);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, (h / 3) * i);
        ctx.lineTo(w, (h / 3) * i);
        ctx.stroke();
    });
}

function perspective(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
    ctx.lineWidth = 2;

    // Diagonals
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w, h);
    ctx.moveTo(w, 0);
    ctx.lineTo(0, h);
    ctx.stroke();

    // Cross
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();
}

function diagonalMethod(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.8)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w, h);
    ctx.moveTo(w, 0);
    ctx.lineTo(0, h);
    ctx.stroke();
}

function baroqueSinisterDiagonals(ctx, w, h) {
    diagonalMethod(ctx, w, h);
}

function harmoniousTriangles(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255, 165, 0, 0.8)';
    ctx.lineWidth = 2;

    const angleWOverH = Math.atan(w / h);
    const angleHOverW = Math.atan(h / w);
    const dst = h * Math.cos(angleWOverH) / Math.cos(angleHOverW);

    const cx = w / 2, cy = h / 2;

    ctx.beginPath();
    ctx.moveTo(cx - w / 2, cy - h / 2);
    ctx.lineTo(cx + w / 2, cy + h / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - w / 2 + dst, cy - h / 2);
    ctx.lineTo(cx - w / 2, cy + h / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + w / 2, cy - h / 2);
    ctx.lineTo(cx + w / 2 - dst, cy + h / 2);
    ctx.stroke();
}

function goldenSections(ctx, w, h) {
    const phi = 0.618;
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
    ctx.lineWidth = 1;

    [[w * phi, 0, w * phi, h], [w * (1 - phi), 0, w * (1 - phi), h],
     [0, h * phi, w, h * phi], [0, h * (1 - phi), w, h * (1 - phi)]].forEach(([x1, y1, x2, y2]) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    });
}

function drawGoldenSpiral(ctx, w, h) {
    const spiral = new Image();
    spiral.onload = () => ctx.drawImage(spiral, 0, 0, w, h);
    spiral.src = 'fibonacci-spiral-overlay.png';
}

function goldenSpiral(ctx, w, h) {
    drawGoldenSpiral(ctx, w, h);
}

function goldenSpiralSections(ctx, w, h) {
    goldenSections(ctx, w, h);
}

// === Action Handler ===
browser.runtime.onMessage.addListener((message) => {
    console.log("Message received:", message);

    if (!rightClickedImg) {
        console.error("No image found to draw on.");
        return;
    }

    const overlay = createOverlay(rightClickedImg);
    const ctx = overlay.getContext('2d');

    if (!ctx) {
        console.error("Failed to get 2D context.");
        return;
    }

    const actions = {
        ruleOfThirds,
        perspective,
        diagonalMethod,
        baroqueSinisterDiagonals,
        harmoniousTriangles,
        goldenSections,
        goldenSpiral: () => createImageOverlay(rightClickedImg, 'fibonacci-spiral-overlay.png'),
        goldenSpiralSections
    };

    const action = actions[message.action];
    if (action) {
        console.log("Executing action:", message.action);
        if (typeof action === 'function' && action.length === 3) {
            action(ctx, overlay.width, overlay.height);
        } else {
            action(); // image overlay
        }
    } else {
        console.error("Unknown action:", message.action);
    }
});
