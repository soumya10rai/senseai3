// Test script to manually set some accessibility preferences
// Run this in browser console to test the popup display

// Simulate some selected accessibility features
const mockPreferences = {
    visual: [
        {
            id: 'increaseFontSize',
            name: 'Increase Font Size',
            icon: '🔤',
            category: 'visual',
            enabled: true
        },
        {
            id: 'increaseContrast',
            name: 'Increase Contrast',
            icon: '🌗',
            category: 'visual',
            enabled: true
        },
        {
            id: 'textToSpeech',
            name: 'Text-to-Speech',
            icon: '🗣️',
            category: 'visual',
            enabled: false
        }
    ],
    dyslexia: [
        {
            id: 'openDyslexicFont',
            name: 'OpenDyslexic Font',
            icon: '🔤',
            category: 'dyslexia',
            enabled: true
        }
    ],
    photosensitivity: [
        {
            id: 'alwaysDarkMode',
            name: 'Always Dark Mode',
            icon: '🌙',
            category: 'photosensitivity',
            enabled: true
        }
    ]
};

// Store mock preferences
chrome.storage.local.set({
    accessibilityPreferences: mockPreferences,
    onboardingComplete: true
}, function() {
    console.log('Mock preferences saved! Refresh the popup to see the features.');
});

// Test function to check current stored preferences
function checkStoredPreferences() {
    chrome.storage.local.get(['accessibilityPreferences'], function(result) {
        console.log('Stored preferences:', result.accessibilityPreferences);
    });
}

// Export functions for testing
window.testBetterWeb = {
    setMockPreferences: () => {
        chrome.storage.local.set({
            accessibilityPreferences: mockPreferences,
            onboardingComplete: true
        });
    },
    checkPreferences: checkStoredPreferences,
    clearPreferences: () => {
        chrome.storage.local.clear();
    }
};