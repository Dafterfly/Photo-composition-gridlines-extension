// Add context menu items for each composition rule when the extension is installed
browser.runtime.onInstalled.addListener(() => {
    const menuItems = [
        { id: "ruleOfThirds", title: "Rule of Thirds" },
        { id: "perspective", title: "Perspective" },
        { id: "diagonalMethod", title: "Diagonal Method" },
        { id: "harmoniousTriangles", title: "Harmonious Triangles" },
        { id: "goldenSections", title: "Golden Sections" },
        { id: "goldenSpiral", title: "Golden Spiral" },
        { id: "goldenSpiralSections", title: "Golden Spiral Sections" }
    ];
    
    menuItems.forEach(item => {
        browser.contextMenus.create({
            id: item.id,
            title: item.title,
            contexts: ["all"]
        });
    });
});

// Handle context menu clicks
browser.contextMenus.onClicked.addListener((info, tab) => {
    console.log("Context menu clicked:", info.menuItemId); // Debug log
    const validActions = ["ruleOfThirds", "perspective", "diagonalMethod", "harmoniousTriangles", "goldenSections", "goldenSpiral", "goldenSpiralSections"];
    
    if (validActions.includes(info.menuItemId)) {
        browser.tabs.sendMessage(tab.id, { action: info.menuItemId });
    }
});
