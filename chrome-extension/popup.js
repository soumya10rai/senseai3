// Popup script for BetterWeb Extension
document.addEventListener('DOMContentLoaded', function() {
    const accessibilityFeatures = document.getElementById('accessibilityFeatures');
    const quickActions = document.getElementById('quickActions');
    const settingsBtn = document.getElementById('settingsBtn');
    
    // Load user preferences and populate features
    chrome.storage.local.get(['accessibilityPreferences', 'onboardingComplete'], function(result) {
        if (!result.onboardingComplete) {
            // Show onboarding prompt
            showOnboardingPrompt();
            return;
        }
        
        if (result.accessibilityPreferences) {
            populateAccessibilityFeatures(result.accessibilityPreferences);
        } else {
            // Show message if no preferences found
            accessibilityFeatures.innerHTML = '<p class="no-features">No accessibility features configured. <a href="#" id="setupLink">Configure now</a></p>';
            document.getElementById('setupLink').addEventListener('click', function(e) {
                e.preventDefault();
                chrome.tabs.create({
                    url: chrome.runtime.getURL('questionnaire.html')
                });
            });
        }
    });
    
    function showOnboardingPrompt() {
        accessibilityFeatures.innerHTML = `
            <div class="onboarding-prompt">
                <p>Welcome to BetterWeb! Complete your setup to get started.</p>
                <button id="startOnboarding" class="btn-primary">Start Setup</button>
            </div>
        `;
        
        document.getElementById('startOnboarding').addEventListener('click', function() {
            chrome.tabs.create({
                url: chrome.runtime.getURL('onboarding.html')
            });
        });
    }
    
    function populateAccessibilityFeatures(preferences) {
        const allFeatures = [];
        
        // Collect all selected features
        Object.keys(preferences).forEach(category => {
            allFeatures.push(...preferences[category]);
        });
        
        if (allFeatures.length === 0) {
            accessibilityFeatures.innerHTML = '<p class="no-features">No accessibility features selected.</p>';
            return;
        }
        
        // Create feature buttons
        allFeatures.forEach(feature => {
            const featureBtn = document.createElement('button');
            featureBtn.className = 'feature-btn';
            featureBtn.dataset.featureId = feature.id;
            featureBtn.dataset.category = feature.category;
            featureBtn.innerHTML = `
                <span class="feature-icon">${feature.icon}</span>
                <span class="feature-name">${feature.name}</span>
                <span class="feature-toggle ${feature.enabled ? 'enabled' : 'disabled'}">
                    ${feature.enabled ? '●' : '○'}
                </span>
            `;
            
            featureBtn.addEventListener('click', function() {
                toggleFeature(feature.id, feature.category);
            });
            
            accessibilityFeatures.appendChild(featureBtn);
        });
    }
    
    function toggleFeature(featureId, category) {
        // Get current preferences
        chrome.storage.local.get(['accessibilityPreferences'], function(result) {
            const preferences = result.accessibilityPreferences || {};
            
            // Find and toggle the feature
            const categoryFeatures = preferences[category] || [];
            const featureIndex = categoryFeatures.findIndex(f => f.id === featureId);
            
            if (featureIndex !== -1) {
                categoryFeatures[featureIndex].enabled = !categoryFeatures[featureIndex].enabled;
                
                // Update storage
                chrome.storage.local.set({ accessibilityPreferences: preferences }, function() {
                    // Apply the feature to current tab
                    applyFeatureToCurrentTab(featureId, category, categoryFeatures[featureIndex].enabled);
                    
                    // Update UI
                    updateFeatureButton(featureId, categoryFeatures[featureIndex].enabled);
                });
            }
        });
    }
    
    function updateFeatureButton(featureId, enabled) {
        const featureBtn = document.querySelector(`[data-feature-id="${featureId}"]`);
        if (featureBtn) {
            const toggle = featureBtn.querySelector('.feature-toggle');
            toggle.className = `feature-toggle ${enabled ? 'enabled' : 'disabled'}`;
            toggle.textContent = enabled ? '●' : '○';
        }
    }
    
    function applyFeatureToCurrentTab(featureId, category, enabled) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'toggleFeature',
                featureId: featureId,
                category: category,
                enabled: enabled
            });
        });
    }
    
    // Quick actions
    quickActions.addEventListener('click', function(e) {
        const actionBtn = e.target.closest('.action-btn');
        if (!actionBtn) return;
        
        const action = actionBtn.dataset.action;
        
        switch(action) {
            case 'resetPage':
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'resetPage' });
                });
                break;
            case 'toggleDarkMode':
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleDarkMode' });
                });
                break;
            case 'openSettings':
                chrome.tabs.create({
                    url: chrome.runtime.getURL('questionnaire.html')
                });
                break;
        }
    });
    
    // Settings button
    settingsBtn.addEventListener('click', function() {
        chrome.tabs.create({
            url: chrome.runtime.getURL('questionnaire.html')
        });
    });
});