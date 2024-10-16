let rightClickedImg = null;

// Track the image that was right-clicked
document.addEventListener('contextmenu', (event) => {
    if (event.target.tagName === 'IMG') {
        rightClickedImg = event.target;
        console.log("Right-clicked image detected:", rightClickedImg);
    }
});

// Function to create and position the overlay
function createOverlay(img) {
    const imgRect = img.getBoundingClientRect();
    const overlay = document.createElement('canvas');

    // Set canvas size to match the image size
    overlay.width = imgRect.width;
    overlay.height = imgRect.height;

    // Position the overlay exactly on top of the image
    overlay.style.position = 'absolute';
    overlay.style.top = `${imgRect.top + window.scrollY}px`; // Account for vertical scrolling
    overlay.style.left = `${imgRect.left + window.scrollX}px`; // Account for horizontal scrolling

    overlay.style.pointerEvents = 'none'; // Ensure no interaction with the overlay
    overlay.style.zIndex = '9999'; // Keep the overlay on top

    // Append the overlay to the body
    document.body.appendChild(overlay);

    console.log("Overlay added with dimensions:", overlay.width, overlay.height);

    return overlay;
}

// Function to draw Rule of Thirds grid
function ruleOfThirds(ctx, width, height) {
    console.log("Drawing Rule of Thirds with dimensions:", width, height);
    
    ctx.clearRect(0, 0, width, height); // Clear previous drawings

    ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)'; // Red color with transparency
    ctx.lineWidth = 2;

    const colWidth = width / 3;
    const rowHeight = height / 3;

    // Draw vertical lines
    for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(i * colWidth, 0);
        ctx.lineTo(i * colWidth, height);
        ctx.stroke();
        console.log("Vertical line drawn at:", i * colWidth);
    }

    // Draw horizontal lines
    for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * rowHeight);
        ctx.lineTo(width, i * rowHeight);
        ctx.stroke();
        console.log("Horizontal line drawn at:", i * rowHeight);
    }

    console.log("Rule of Thirds grid drawn successfully.");
}

// Listen for messages from the background script
browser.runtime.onMessage.addListener((message) => {
    console.log("Message received:", message);  // Log the entire message

    const img = rightClickedImg;
    if (!img) {
        console.error("No image found to draw on.");
        return;
    }

    const overlay = createOverlay(img);
    const ctx = overlay.getContext("2d");

    if (!ctx) {
        console.error("Failed to get 2D context from the canvas.");
        return;
    }

    // Define actions object
    const actions = {
        ruleOfThirds
    };

    // Log the available actions
    console.log("Available actions:", Object.keys(actions));

    // Check if the message action matches a function
    if (actions[message.action]) {
        console.log("Executing action:", message.action);
        actions[message.action](ctx, overlay.width, overlay.height); // Call the function with canvas context and overlay size
    } else {
        console.error("No matching action found for:", message.action);
    }
});

// Recalculate position when window is resized or scrolled
window.addEventListener('resize', updateOverlayPosition);
window.addEventListener('scroll', updateOverlayPosition);

function updateOverlayPosition() {
    const img = rightClickedImg;
    if (!img) return;

    const imgRect = img.getBoundingClientRect();
    const overlay = document.querySelector('canvas');

    if (overlay) {
        // Update the position based on the current scroll and layout
        overlay.style.top = `${imgRect.top + window.scrollY}px`;
        overlay.style.left = `${imgRect.left + window.scrollX}px`;

        console.log("Overlay position updated:", overlay.style.top, overlay.style.left);
    }
}
