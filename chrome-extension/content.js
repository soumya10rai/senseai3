// Content script for BetterWeb Extension
class BetterWebContentScript {
    constructor() {
        this.appliedFeatures = new Set();
        this.init();
    }
    
    init() {
        // Load saved preferences and apply them
        this.loadAndApplyPreferences();
        
        // Listen for messages from popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.handleMessage(request, sender, sendResponse);
        });
    }
    
    loadAndApplyPreferences() {
        chrome.storage.local.get(['accessibilityPreferences'], (result) => {
            if (result.accessibilityPreferences) {
                this.applyAllFeatures(result.accessibilityPreferences);
            }
        });
    }
    
    applyAllFeatures(preferences) {
        Object.keys(preferences).forEach(category => {
            preferences[category].forEach(feature => {
                if (feature.enabled) {
                    this.applyFeature(feature.id, category, true);
                }
            });
        });
    }
    
    handleMessage(request, sender, sendResponse) {
        switch(request.action) {
            case 'toggleFeature':
                this.applyFeature(request.featureId, request.category, request.enabled);
                sendResponse({ success: true });
                break;
            case 'resetPage':
                this.resetPage();
                sendResponse({ success: true });
                break;
            case 'toggleDarkMode':
                this.toggleDarkMode();
                sendResponse({ success: true });
                break;
            default:
                sendResponse({ success: false, error: 'Unknown action' });
        }
    }
    
    applyFeature(featureId, category, enabled) {
        const featureKey = `${category}-${featureId}`;
        
        if (enabled) {
            this.appliedFeatures.add(featureKey);
        } else {
            this.appliedFeatures.delete(featureKey);
        }
        
        switch(featureId) {
            case 'increaseFontSize':
                this.toggleFontSize(enabled);
                break;
            case 'increaseContrast':
                this.toggleContrast(enabled);
                break;
            case 'textToSpeech':
                this.toggleTextToSpeech(enabled);
                break;
            case 'zoomTool':
                this.toggleZoom(enabled);
                break;
            case 'cursorEnhancer':
                this.toggleCursorEnhancer(enabled);
                break;
            case 'colorblindMode':
                this.toggleColorblindMode(enabled);
                break;
            case 'lineHighlighting':
                this.toggleLineHighlighting(enabled);
                break;
            case 'reduceAnimation':
                this.toggleReduceAnimation(enabled);
                break;
            case 'openDyslexicFont':
                this.toggleDyslexicFont(enabled);
                break;
            case 'letterSpacing':
                this.toggleLetterSpacing(enabled);
                break;
            case 'lineSpacing':
                this.toggleLineSpacing(enabled);
                break;
            case 'readingRuler':
                this.toggleReadingRuler(enabled);
                break;
            case 'backgroundTint':
                this.toggleBackgroundTint(enabled);
                break;
            case 'focusMode':
                this.toggleFocusMode(enabled);
                break;
            case 'hideDistractions':
                this.toggleHideDistractions(enabled);
                break;
            case 'alwaysDarkMode':
                this.toggleAlwaysDarkMode(enabled);
                break;
            case 'reduceBrightColors':
                this.toggleReduceBrightColors(enabled);
                break;
            case 'blockFlashAnimations':
                this.toggleBlockFlashAnimations(enabled);
                break;
            case 'reduceBrightness':
                this.toggleReduceBrightness(enabled);
                break;
            case 'softColorContrast':
                this.toggleSoftColorContrast(enabled);
                break;
            case 'fewerAnimations':
                this.toggleFewerAnimations(enabled);
                break;
        }
    }
    
    // Visual accessibility features
    toggleFontSize(enabled) {
        const styleId = 'betterweb-font-size';
        this.removeStyle(styleId);
        
        if (enabled) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                * {
                    font-size: 1.2em !important;
                }
                h1 { font-size: 2.5em !important; }
                h2 { font-size: 2.2em !important; }
                h3 { font-size: 1.8em !important; }
                h4 { font-size: 1.5em !important; }
                h5 { font-size: 1.3em !important; }
                h6 { font-size: 1.1em !important; }
            `;
            document.head.appendChild(style);
        }
    }
    
    toggleContrast(enabled) {
        const styleId = 'betterweb-contrast';
        this.removeStyle(styleId);
        
        if (enabled) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                * {
                    filter: contrast(150%) !important;
                }
                img, video {
                    filter: contrast(120%) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    toggleZoom(enabled) {
        if (enabled) {
            document.body.style.zoom = '1.2';
        } else {
            document.body.style.zoom = '1';
        }
    }
    
    toggleCursorEnhancer(enabled) {
        const styleId = 'betterweb-cursor';
        this.removeStyle(styleId);
        
        if (enabled) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                * {
                    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="red" opacity="0.5"/></svg>') 12 12, auto !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    toggleColorblindMode(enabled) {
        const styleId = 'betterweb-colorblind';
        this.removeStyle(styleId);
        
        if (enabled) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                * {
                    filter: grayscale(0.3) contrast(1.2) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    toggleLineHighlighting(enabled) {
        const styleId = 'betterweb-line-highlight';
        this.removeStyle(styleId);
        
        if (enabled) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                p:hover, div:hover, span:hover {
                    background-color: rgba(255, 255, 0, 0.2) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    toggleReduceAnimation(enabled) {
        const styleId = 'betterweb-reduce-animation';
        this.removeStyle(styleId);
        
        if (enabled) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Dyslexia/Learning features
    toggleDyslexicFont(enabled) {
        const styleId = 'betterweb-dyslexic-font';
        this.removeStyle(styleId);
        
        if (enabled) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                * {
                    font-family: "Comic Sans MS", "OpenDyslexic", "Clear Sans", sans-serif !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    toggleLetterSpacing(enabled) {
        const styleId = 'betterweb-letter-spacing';
        this.removeStyle(styleId);
        
        if (enabled) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                * {
                    letter-spacing: 0.1em !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    toggleLineSpacing(enabled) {
        const styleId = 'betterweb-line-spacing';
        this.removeStyle(styleId);
        
        if (enabled) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                * {
                    line-height: 1.8 !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    toggleReadingRuler(enabled) {
        const rulerId = 'betterweb-reading-ruler';
        const existingRuler = document.getElementById(rulerId);
        
        if (existingRuler) {
            existingRuler.remove();
        }
        
        if (enabled) {
            const ruler = document.createElement('div');
            ruler.id = rulerId;
            ruler.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background-color: rgba(255, 0, 0, 0.7);
                pointer-events: none;
                z-index: 10000;
                transition: top 0.1s ease;
            `;
            document.body.appendChild(ruler);
            
            document.addEventListener('mousemove', (e) => {
                ruler.style.top = e.clientY + 'px';
            });
        }
    }
    
    toggleBackgroundTint(enabled) {
        const styleId = 'betterweb-background-tint';
        this.removeStyle(styleId);
        
        if (enabled) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                body {
                    background-color: rgba(255, 248, 220, 0.8) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // ADHD/Focus features
    toggleFocusMode(enabled) {
        const styleId = 'betterweb-focus-mode';
        this.removeStyle(styleId);
        
        if (enabled) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                * {
                    outline: 2px solid transparent !important;
                }
                *:focus {
                    outline: 3px solid #007cba !important;
                    outline-offset: 2px !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    toggleHideDistractions(enabled) {
        const styleId = 'betterweb-hide-distractions';
        this.removeStyle(styleId);
        
        if (enabled) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                img[src*="ad"], img[src*="banner"], 
                div[class*="ad"], div[id*="ad"],
                div[class*="banner"], div[id*="banner"],
                iframe[src*="ad"], iframe[src*="banner"] {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Photosensitivity features
    toggleAlwaysDarkMode(enabled) {
        const styleId = 'betterweb-dark-mode';
        this.removeStyle(styleId);
        
        if (enabled) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                * {
                    background-color: #1a1a1a !important;
                    color: #e0e0e0 !important;
                }
                a {
                    color: #4da6ff !important;
                }
                img {
                    filter: brightness(0.8) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    toggleReduceBrightColors(enabled) {
        const styleId = 'betterweb-reduce-bright';
        this.removeStyle(styleId);
        
        if (enabled) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                * {
                    filter: brightness(0.7) saturate(0.5) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    toggleBlockFlashAnimations(enabled) {
        const styleId = 'betterweb-block-flash';
        this.removeStyle(styleId);
        
        if (enabled) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                * {
                    animation: none !important;
                }
                @keyframes * {
                    0% { opacity: 1; }
                    100% { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Neuro-cognitive features
    toggleReduceBrightness(enabled) {
        const styleId = 'betterweb-reduce-brightness';
        this.removeStyle(styleId);
        
        if (enabled) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                * {
                    filter: brightness(0.6) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    toggleSoftColorContrast(enabled) {
        const styleId = 'betterweb-soft-contrast';
        this.removeStyle(styleId);
        
        if (enabled) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                * {
                    filter: contrast(0.8) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    toggleFewerAnimations(enabled) {
        const styleId = 'betterweb-fewer-animations';
        this.removeStyle(styleId);
        
        if (enabled) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                * {
                    animation-duration: 0.5s !important;
                    transition-duration: 0.3s !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Quick actions
    resetPage() {
        // Remove all BetterWeb styles
        const betterWebStyles = document.querySelectorAll('style[id^="betterweb-"]');
        betterWebStyles.forEach(style => style.remove());
        
        // Remove reading ruler
        const ruler = document.getElementById('betterweb-reading-ruler');
        if (ruler) ruler.remove();
        
        // Reset body zoom
        document.body.style.zoom = '1';
        
        // Clear applied features
        this.appliedFeatures.clear();
    }
    
    toggleDarkMode() {
        const isDarkMode = this.appliedFeatures.has('photosensitivity-alwaysDarkMode');
        this.applyFeature('alwaysDarkMode', 'photosensitivity', !isDarkMode);
    }
    
    toggleTextToSpeech(enabled) {
        if (enabled) {
            this.enableTextToSpeech();
        } else {
            this.disableTextToSpeech();
        }
    }
    
    enableTextToSpeech() {
        // Add click listeners to text elements
        document.addEventListener('click', this.handleTextToSpeechClick.bind(this));
        
        // Add visual indicators
        const styleId = 'betterweb-tts-indicator';
        this.removeStyle(styleId);
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            p:hover, h1:hover, h2:hover, h3:hover, h4:hover, h5:hover, h6:hover, 
            div:hover, span:hover, a:hover {
                background-color: rgba(0, 123, 255, 0.1) !important;
                cursor: pointer !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    disableTextToSpeech() {
        document.removeEventListener('click', this.handleTextToSpeechClick.bind(this));
        this.removeStyle('betterweb-tts-indicator');
    }
    
    handleTextToSpeechClick(event) {
        const element = event.target;
        const text = element.textContent || element.innerText;
        
        if (text && text.trim().length > 0) {
            // Stop any ongoing speech
            speechSynthesis.cancel();
            
            // Create speech utterance
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            
            // Speak the text
            speechSynthesis.speak(utterance);
            
            // Prevent default action
            event.preventDefault();
            event.stopPropagation();
        }
    }
    
    // Utility methods
    removeStyle(styleId) {
        const existingStyle = document.getElementById(styleId);
        if (existingStyle) {
            existingStyle.remove();
        }
    }
}

// Initialize content script
new BetterWebContentScript();