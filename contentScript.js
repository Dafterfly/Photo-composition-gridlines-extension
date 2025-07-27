


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

function createImageOverlay(img, src) {
    const overlayImg = document.createElement('img');

    overlayImg.src = browser.runtime.getURL(src);
    overlayImg.style.position = 'absolute';
    overlayImg.style.top = `${0}px`;
    overlayImg.style.left = `${0}px`;
    overlayImg.style.width = `${img.offsetWidth}px`;
    overlayImg.style.height = `${img.offsetHeight}px`;
    overlayImg.style.pointerEvents = 'none';
    overlayImg.style.zIndex = '9999';
    overlayImg.classList.add('spiral-overlay');

    img.parentElement.appendChild(overlayImg);
    console.log("Spiral PNG overlay added at exact image position:", overlayImg.src);

    return overlayImg;
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

function drawGoldenSpiral(ctx, width, height) {
    // First draw your existing content on canvas
    // ctx.drawImage(...) or other drawing operations
    
    // Then load and overlay the spiral PNG
    const spiralImg = new Image();
    spiralImg.onload = function() {
        // Draw the spiral image on top of existing content
        ctx.drawImage(
            spiralImg, 
            0, 0, width, height  // Adjust position/size as needed
        );
    };
    spiralImg.src = 'fibonacci-spiral-overlay.png';
}

function goldenSpiral(ctx, width, height) {
drawGoldenSpiral(ctx, width, height)
}



// 7. Golden Spiral Sections
function goldenSpiralSections(ctx, width, height) {
    //goldenSpiral(ctx, width, height);
    
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
        goldenSpiral: (ctx, width, height) => {
        createImageOverlay(rightClickedImg, 'fibonacci-spiral-overlay.png');
    },
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
    const canvasOverlay = document.querySelector('canvas');
    const imageOverlay = document.querySelector('img.spiral-overlay');

    const top = `${imgRect.top + window.scrollY}px`;
    const left = `${imgRect.left + window.scrollX}px`;

    if (canvasOverlay) {
        canvasOverlay.style.top = top;
        canvasOverlay.style.left = left;
    }

    if (imageOverlay) {
        imageOverlay.style.top = top;
        imageOverlay.style.left = left;
    }

    console.log("Overlay position updated:", top, left);
}

