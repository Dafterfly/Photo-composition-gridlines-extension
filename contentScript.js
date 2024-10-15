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

    // Draw the rule of thirds lines
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


// Placeholder for Golden Spiral and other rules
function drawGoldenSpiral(ctx, width, height) {
    // You can implement the golden spiral logic here
}

function drawPerspective(ctx, width, height) {
    // You can implement perspective logic here
}
