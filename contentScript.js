// Track the image that was right-clicked, or find an image within the clicked element
let rightClickedImg = null;

// Track the image that was right-clicked, or find an image within the clicked element
document.addEventListener('contextmenu', (event) => {
    if (event.target.tagName === 'IMG') {
        rightClickedImg = event.target;
    } else {
        // Check if the clicked element has a background image
        const backgroundImage = window.getComputedStyle(event.target).backgroundImage;

        if (backgroundImage && backgroundImage !== 'none') {
            // Extract the URL from the background-image style
            const urlMatch = backgroundImage.match(/url\(["']?(.+?)["']?\)/);

            if (urlMatch && urlMatch[1]) {
                // Create a temporary image object with the extracted URL
                rightClickedImg = new Image();
                rightClickedImg.src = urlMatch[1];
                console.log("Background image URL found:", rightClickedImg.src);
            }
        } else {
            // Look for an IMG element inside the clicked element
            rightClickedImg = event.target.querySelector('img');
        }
    }

    // Log to check which element was found (image or null)
    if (rightClickedImg) {
        console.log("Image found for context menu:", rightClickedImg.src);
    } else {
        console.log("No image found in clicked element");
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

// 2. Perspective (Cross and diagonals from corners to center)
function perspective(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
    ctx.lineWidth = 2;

    // Draw diagonal lines from corners to the center
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.moveTo(width, 0);
    ctx.lineTo(0, height);
    ctx.stroke();

    // Draw center cross
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
}

// 3. Diagonal Method (Corner to corner)
function baroqueSinisterDiagonals(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
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


// 3. Diagonal Method (Corner to corner)
function diagonalMethod(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
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

// 4. Harmonious Triangles
function harmoniousTriangles(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(255, 165, 0, 0.8)'; // Orange for harmonious triangles
    ctx.lineWidth = 2;

    // Calculate dst value (the same way Darktable calculates it)
    const angleWidthOverHeight = Math.atan(width / height);
    const angleHeightOverWidth = Math.atan(height / width);
    const dst = height * Math.cos(angleWidthOverHeight) / Math.cos(angleHeightOverWidth);

    // Adjust the coordinates to work with the canvas, centered around the middle
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw the main diagonal (from top-left to bottom-right)
    ctx.beginPath();
    ctx.moveTo(-width / 2 + centerX, -height / 2 + centerY); // Starting from top-left
    ctx.lineTo(width / 2 + centerX, height / 2 + centerY);   // Ending at bottom-right
    ctx.stroke();

    // Draw the line from the bottom-left corner to meet the diagonal
    ctx.beginPath();
    ctx.moveTo(-width / 2 + dst + centerX, -height / 2 + centerY); // Left side shifted by dst
    ctx.lineTo(-width / 2 + centerX, height / 2 + centerY);        // Ending at bottom-left
    ctx.stroke();

    // Draw the line from the top-right corner to meet the diagonal
    ctx.beginPath();
    ctx.moveTo(width / 2 + centerX, -height / 2 + centerY);       // Starting at top-right
    ctx.lineTo(width / 2 - dst + centerX, height / 2 + centerY);  // Right side shifted by dst
    ctx.stroke();
}



// 5. Golden Sections
function goldenSections(ctx, width, height) {
    const phi = 0.618; // Golden ratio reciprocal
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
    ctx.lineWidth = 2;

    // Vertical golden sections
    ctx.beginPath();
    ctx.moveTo(width * phi, 0);
    ctx.lineTo(width * phi, height);
    ctx.moveTo(width * (1 - phi), 0);
    ctx.lineTo(width * (1 - phi), height);
    ctx.stroke();

    // Horizontal golden sections
    ctx.beginPath();
    ctx.moveTo(0, height * phi);
    ctx.lineTo(width, height * phi);
    ctx.moveTo(0, height * (1 - phi));
    ctx.lineTo(width, height * (1 - phi));
    ctx.stroke();
}

// 6. Golden Spiral
function goldenSpiral(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);  // Clear the canvas
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)'; // Golden color
    ctx.lineWidth = 2;

    // Define the golden ratio (phi and its inverse)
    const phi = (1 + Math.sqrt(5)) / 2;
    const invPhi = 1 / phi;

    // Define the rectangles R1 to R7
    const R1 = { left: 0, top: 0, width: width, height: height };
    const R2 = { left: width * invPhi, top: 0, width: width * (1 - invPhi), height: height * invPhi };
    const R3 = { left: R2.left, top: height * invPhi, width: R2.width * invPhi, height: R2.height };
    const R4 = { left: R3.left, top: R3.top, width: R3.width * invPhi, height: R3.height * invPhi };
    const R5 = { left: R4.left, top: R4.top + R4.height, width: R4.width * invPhi, height: R4.height * invPhi };
    const R6 = { left: R5.left + R5.width, top: R5.top, width: R5.width * invPhi, height: R5.height * invPhi };
    const R7 = { left: R6.left, top: R6.top - R6.height, width: R6.width * invPhi, height: R6.height * invPhi };

    // Helper function to draw an arc with scaling
    function drawScaledArc(rect, startAngle, endAngle, scaleX = 1, scaleY = 1) {
        ctx.save();
        ctx.beginPath();
        ctx.scale(scaleX, scaleY);
        ctx.arc(rect.left + rect.width, rect.top + rect.height, rect.height, startAngle, endAngle);
        ctx.stroke();
        ctx.restore();
    }

    // Draw the arcs for the golden spiral
    drawScaledArc(R1, Math.PI / 2, Math.PI, R1.width / R1.height, 1); // Arc in R1
    drawScaledArc(R2, 0, Math.PI / 2, R2.width / R2.height, 1);       // Arc in R2
    drawScaledArc(R3, Math.PI * 3 / 2, 2 * Math.PI, R3.width / R3.height, 1); // Arc in R3
    drawScaledArc(R4, Math.PI, Math.PI * 3 / 2, 1, R4.height / R4.width); // Arc in R4
    drawScaledArc(R5, Math.PI / 2, Math.PI, 1, R5.height / R5.width); // Arc in R5
    drawScaledArc(R6, 0, Math.PI / 2, 1, R6.height / R6.width);       // Arc in R6
    drawScaledArc(R7, Math.PI * 3 / 2, 2 * Math.PI, R7.width / R7.height, 1); // Arc in R7
}



// 7. Golden Spiral Sections
function goldenSpiralSections(ctx, width, height) {
    goldenSpiral(ctx, width, height);

    // Add golden section lines
    const phi = 0.618;
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(width * phi, 0);
    ctx.lineTo(width * phi, height);
    ctx.moveTo(width * (1 - phi), 0);
    ctx.lineTo(width * (1 - phi), height);
    ctx.moveTo(0, height * phi);
    ctx.lineTo(width, height * phi);
    ctx.moveTo(0, height * (1 - phi));
    ctx.lineTo(width, height * (1 - phi));
    ctx.stroke();
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
        ruleOfThirds,
        perspective,
        diagonalMethod,
        baroqueSinisterDiagonals,
        harmoniousTriangles,
        goldenSections,
        goldenSpiral,
        goldenSpiralSections
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
