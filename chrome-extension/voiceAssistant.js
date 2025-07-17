// Voice Assistant for BetterWeb Extension
class VoiceAssistant {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.voiceBtn = null;
        this.voiceStatus = null;
        this.init();
    }
    
    init() {
        // Wait for DOM to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupUI());
        } else {
            this.setupUI();
        }
    }
    
    setupUI() {
        this.voiceBtn = document.getElementById('voiceBtn');
        this.voiceStatus = document.getElementById('voiceStatus');
        
        if (this.voiceBtn) {
            this.voiceBtn.addEventListener('click', () => this.toggleListening());
        }
        
        // Check for speech recognition support
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.showError('Speech recognition not supported in this browser.');
            return;
        }
        
        this.setupSpeechRecognition();
    }
    
    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = true; // Enable interim results for real-time transcript
        this.recognition.lang = 'en-US';
        
        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUI('listening');
        };
        
        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            
            // Show real-time transcript
            this.showTranscript(interimTranscript || finalTranscript);
            
            // Process final transcript
            if (finalTranscript) {
                this.processVoiceCommand(finalTranscript.toLowerCase());
            }
        };
        
        this.recognition.onerror = (event) => {
            let errorMessage = '';
            
            switch(event.error) {
                case 'no-speech':
                    errorMessage = 'No speech detected. Please try again.';
                    break;
                case 'audio-capture':
                    errorMessage = 'Microphone not accessible. Please check permissions.';
                    break;
                case 'not-allowed':
                    errorMessage = 'Microphone permission denied. Please enable microphone access.';
                    break;
                case 'network':
                    errorMessage = 'Network error. Please check your connection.';
                    break;
                default:
                    errorMessage = `Speech recognition error: ${event.error}`;
            }
            
            this.showError(errorMessage);
            this.isListening = false;
            this.updateUI('idle');
        };
        
        this.recognition.onend = () => {
            this.isListening = false;
            this.updateUI('idle');
        };
    }
    
    async toggleListening() {
        if (this.isListening) {
            this.recognition.stop();
            return;
        }
        
        try {
            // Request microphone permission explicitly
            const permissionResult = await navigator.permissions.query({name: 'microphone'});
            
            if (permissionResult.state === 'denied') {
                this.showError('Microphone permission denied. Please enable microphone access in your browser settings.');
                return;
            }
            
            // Test microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.showSuccess('Microphone access granted. Starting voice recognition...');
            
            // Stop the stream immediately (we don't need to keep it open)
            stream.getTracks().forEach(track => track.stop());
            
            // Start speech recognition
            this.recognition.start();
            
        } catch (error) {
            let errorMessage = '';
            
            switch(error.name) {
                case 'NotAllowedError':
                    errorMessage = 'Microphone permission denied. Please click the microphone icon in your browser address bar and allow access.';
                    break;
                case 'NotFoundError':
                    errorMessage = 'No microphone found. Please check your microphone connection.';
                    break;
                case 'AbortError':
                    errorMessage = 'Microphone access was aborted. Please try again.';
                    break;
                default:
                    errorMessage = `Microphone error: ${error.message}`;
            }
            
            this.showError(errorMessage);
        }
    }
    
    processVoiceCommand(transcript) {
        this.updateUI('processing');
        
        console.log('Voice command received:', transcript);
        
        // Dark mode command (bonus feature)
        if (transcript.includes('dark mode') || transcript.includes('darkmode')) {
            this.handleDarkModeToggle();
        }
        // Shopping commands
        else if (transcript.includes('buy') || transcript.includes('purchase')) {
            this.handleShoppingCommand(transcript);
        }
        // Show/search commands
        else if (transcript.includes('show me') || transcript.includes('search for')) {
            this.handleSearchCommand(transcript);
        }
        // Accessibility commands
        else if (transcript.includes('increase font size') || transcript.includes('larger font')) {
            this.handleAccessibilityCommand('increaseFontSize', true);
        }
        else if (transcript.includes('turn on high contrast') || transcript.includes('enable high contrast')) {
            this.handleAccessibilityCommand('increaseContrast', true);
        }
        else if (transcript.includes('enable dark mode') || transcript.includes('turn on dark mode')) {
            this.handleAccessibilityCommand('alwaysDarkMode', true);
        }
        else if (transcript.includes('reduce animation') || transcript.includes('fewer animations')) {
            this.handleAccessibilityCommand('reduceAnimation', true);
        }
        else if (transcript.includes('focus mode') || transcript.includes('enable focus mode')) {
            this.handleAccessibilityCommand('focusMode', true);
        }
        else {
            this.showError('Command not recognized. Try: "Dark mode", "Buy medicine from Apollo", or "Turn on high contrast"');
        }
    }
    
    handleShoppingCommand(transcript) {
        let query = '';
        let site = '';
        
        // Extract product and site from transcript
        if (transcript.includes('from apollo pharmacy') || transcript.includes('apollo pharmacy')) {
            site = 'apollo';
            query = transcript.replace(/buy|purchase|from apollo pharmacy|apollo pharmacy/gi, '').trim();
        } else if (transcript.includes('from amazon') || transcript.includes('amazon')) {
            site = 'amazon';
            query = transcript.replace(/buy|purchase|from amazon|amazon/gi, '').trim();
        } else if (transcript.includes('from flipkart') || transcript.includes('flipkart')) {
            site = 'flipkart';
            query = transcript.replace(/buy|purchase|from flipkart|flipkart/gi, '').trim();
        } else {
            // Default to Amazon if no site specified
            site = 'amazon';
            query = transcript.replace(/buy|purchase/gi, '').trim();
        }
        
        this.openShoppingSite(site, query);
    }
    
    handleSearchCommand(transcript) {
        let query = '';
        let site = '';
        
        // Extract search query and site
        if (transcript.includes('on amazon') || transcript.includes('amazon')) {
            site = 'amazon';
            query = transcript.replace(/show me|search for|on amazon|amazon/gi, '').trim();
        } else if (transcript.includes('on flipkart') || transcript.includes('flipkart')) {
            site = 'flipkart';
            query = transcript.replace(/show me|search for|on flipkart|flipkart/gi, '').trim();
        } else {
            // Default to Google search
            site = 'google';
            query = transcript.replace(/show me|search for/gi, '').trim();
        }
        
        this.openSearchSite(site, query);
    }
    
    openShoppingSite(site, query) {
        let url = '';
        
        switch(site) {
            case 'apollo':
                url = `https://www.apollopharmacy.in/search-medicines/${encodeURIComponent(query)}`;
                break;
            case 'amazon':
                url = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
                break;
            case 'flipkart':
                url = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
                break;
            default:
                url = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
        }
        
        chrome.runtime.sendMessage({
            action: 'openTab',
            url: url
        });
        
        this.showSuccess(`Opening ${site} with search for "${query}"`);
    }
    
    openSearchSite(site, query) {
        let url = '';
        
        switch(site) {
            case 'amazon':
                url = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
                break;
            case 'flipkart':
                url = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
                break;
            default:
                url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
        
        chrome.runtime.sendMessage({
            action: 'openTab',
            url: url
        });
        
        this.showSuccess(`Searching for "${query}"`);
    }
    
    handleAccessibilityCommand(featureId, enabled) {
        // Apply the accessibility feature
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'toggleFeature',
                featureId: featureId,
                enabled: enabled
            });
        });
        
        this.showSuccess(`${enabled ? 'Enabled' : 'Disabled'} ${featureId}`);
    }
    
    updateUI(state) {
        if (!this.voiceBtn || !this.voiceStatus) return;
        
        const voiceText = this.voiceBtn.querySelector('.voice-text');
        const voiceIcon = this.voiceBtn.querySelector('.voice-icon');
        
        switch(state) {
            case 'listening':
                voiceText.textContent = 'Listening...';
                voiceIcon.textContent = '🔴';
                this.voiceBtn.classList.add('listening');
                this.voiceStatus.textContent = 'Listening for your command...';
                break;
            case 'processing':
                voiceText.textContent = 'Processing...';
                voiceIcon.textContent = '⚡';
                this.voiceBtn.classList.remove('listening');
                this.voiceStatus.textContent = 'Processing your command...';
                break;
            case 'idle':
            default:
                voiceText.textContent = 'Click to Speak';
                voiceIcon.textContent = '🎙️';
                this.voiceBtn.classList.remove('listening');
                this.voiceStatus.textContent = '';
        }
    }
    
    showError(message) {
        this.voiceStatus.textContent = message;
        this.voiceStatus.className = 'voice-status error';
        setTimeout(() => {
            this.voiceStatus.textContent = '';
            this.voiceStatus.className = 'voice-status';
        }, 3000);
    }
    
    showSuccess(message) {
        this.voiceStatus.textContent = message;
        this.voiceStatus.className = 'voice-status success';
        setTimeout(() => {
            this.voiceStatus.textContent = '';
            this.voiceStatus.className = 'voice-status';
        }, 3000);
    }
}

// Initialize voice assistant when popup loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new VoiceAssistant();
    });
} else {
    new VoiceAssistant();
}