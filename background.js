// === Add context menu items on extension install ===
browser.runtime.onInstalled.addListener(() => {
    const compositionRules = [
        "ruleOfThirds",
        "perspective",
        "diagonalMethod",
        "harmoniousTriangles",
        "goldenSections",
        "goldenSpiral"
    ];

    compositionRules.forEach(rule => {
        browser.contextMenus.create({
            id: rule,
            title: rule.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim(),
            contexts: ["all"]
        });
    });
});

// === Handle context menu clicks ===
browser.contextMenus.onClicked.addListener((info, tab) => {
    const action = info.menuItemId;

    const supportedActions = [
        "ruleOfThirds",
        "perspective",
        "diagonalMethod",
        "baroqueSinisterDiagonals",
        "harmoniousTriangles",
        "goldenSections",
        "goldenSpiral"
    ];

    if (supportedActions.includes(action)) {
        browser.tabs.sendMessage(tab.id, { action });
    } else {
        console.warn("Unsupported context menu action:", action);
    }
});
