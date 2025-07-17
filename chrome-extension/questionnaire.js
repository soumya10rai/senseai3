// Questionnaire script for BetterWeb Extension
document.addEventListener('DOMContentLoaded', function() {
    const accessibilityForm = document.getElementById('accessibilityForm');
    
    // Feature definitions with display names and descriptions
    const featureDefinitions = {
        visual: {
            increaseFontSize: { name: 'Increase Font Size', icon: '🔤' },
            increaseContrast: { name: 'Increase Contrast', icon: '🌗' },
            textToSpeech: { name: 'Text-to-Speech', icon: '🗣️' },
            zoomTool: { name: 'Zoom Tool', icon: '🔍' },
            cursorEnhancer: { name: 'Cursor Enhancer', icon: '↗️' },
            screenReaderLabels: { name: 'Screen Reader Labels', icon: '🏷️' },
            colorblindMode: { name: 'Colorblind Mode', icon: '🎨' },
            lineHighlighting: { name: 'Line Highlighting', icon: '📝' },
            textMagnifier: { name: 'Text Magnifier', icon: '🔍' },
            reduceAnimation: { name: 'Reduce Animation', icon: '🎬' }
        },
        dyslexia: {
            openDyslexicFont: { name: 'OpenDyslexic Font', icon: '🔤' },
            letterSpacing: { name: 'Letter Spacing', icon: '📏' },
            lineSpacing: { name: 'Line Spacing', icon: '📐' },
            syllableHighlight: { name: 'Syllable Highlighting', icon: '✨' },
            readingRuler: { name: 'Reading Ruler', icon: '📏' },
            backgroundTint: { name: 'Background Tint', icon: '🎨' }
        },
        adhd: {
            largerFonts: { name: 'Larger Fonts', icon: '🔤' },
            focusMode: { name: 'Focus Mode', icon: '🎯' },
            hideDistractions: { name: 'Hide Distractions', icon: '🚫' },
            soundFeedback: { name: 'Sound Feedback', icon: '🔊' },
            taskChunking: { name: 'Task Chunking', icon: '📋' }
        },
        photosensitivity: {
            alwaysDarkMode: { name: 'Always Dark Mode', icon: '🌙' },
            reduceBrightColors: { name: 'Reduce Bright Colors', icon: '🌈' },
            blockFlashAnimations: { name: 'Block Flash Animations', icon: '⚡' }
        },
        neuroCognitive: {
            reduceBrightness: { name: 'Reduce Brightness', icon: '🔅' },
            highStructureLayout: { name: 'High Structure Layout', icon: '🏗️' },
            softColorContrast: { name: 'Soft Color Contrast', icon: '🎨' },
            fewerAnimations: { name: 'Fewer Animations', icon: '🎬' }
        }
    };
    
    accessibilityForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(accessibilityForm);
        const selectedFeatures = {
            visual: [],
            dyslexia: [],
            adhd: [],
            photosensitivity: [],
            neuroCognitive: []
        };
        
        // Collect selected features
        for (const [key, value] of formData.entries()) {
            if (selectedFeatures[key]) {
                selectedFeatures[key].push(value);
            }
        }
        
        // Create feature objects with metadata
        const processedFeatures = {};
        Object.keys(selectedFeatures).forEach(category => {
            processedFeatures[category] = selectedFeatures[category].map(feature => ({
                id: feature,
                name: featureDefinitions[category][feature].name,
                icon: featureDefinitions[category][feature].icon,
                category: category,
                enabled: true
            }));
        });
        
        // Store preferences in Chrome storage
        chrome.storage.local.set({
            accessibilityPreferences: processedFeatures,
            onboardingComplete: true
        }, function() {
            // Show completion message
            showCompletionMessage();
        });
    });
    
    function showCompletionMessage() {
        const form = document.getElementById('accessibilityForm');
        form.innerHTML = `
            <div class="completion-message">
                <div class="success-icon">✅</div>
                <h2>All Set!</h2>
                <p>Your accessibility preferences have been saved. You can now access BetterWeb from the extension popup.</p>
                <button id="closeBtn" class="btn-primary">Get Started</button>
            </div>
        `;
        
        document.getElementById('closeBtn').addEventListener('click', function() {
            window.close();
        });
    }
});