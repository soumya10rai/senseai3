// Background script for BetterWeb Extension
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // On first install, check if user has completed onboarding
    const result = await chrome.storage.local.get(['onboardingComplete']);
    if (!result.onboardingComplete) {
      // Open onboarding page
      chrome.tabs.create({
        url: chrome.runtime.getURL('onboarding.html')
      });
    }
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openTab') {
    chrome.tabs.create({ url: request.url });
    sendResponse({ success: true });
  }
  return true;
});

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  const result = await chrome.storage.local.get(['onboardingComplete']);
  if (!result.onboardingComplete) {
    chrome.tabs.create({
      url: chrome.runtime.getURL('onboarding.html')
    });
  }
});