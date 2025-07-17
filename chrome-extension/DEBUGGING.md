# BetterWeb Extension - Debugging Guide

## 🔧 Fixed Issues Summary

### ✅ 1. **Accessibility Features Not Displaying**
**Problem:** Extension showed "No accessibility features selected" even after selecting features.

**Solution:** 
- Fixed the `populateAccessibilityFeatures()` function to only show enabled features
- Added proper error handling when no preferences are found
- Added helpful links to configure features when none are enabled
- Added a "Manage All Features" button for easy access to settings

### ✅ 2. **Enhanced Microphone Access**
**Problem:** Basic microphone permission handling without proper error messages.

**Solution:**
- Added comprehensive error handling for different microphone error types
- Added explicit permission checking before accessing microphone
- Added real-time transcript display showing what user is saying
- Added better UI feedback for different microphone states

### ✅ 3. **Voice Command for Dark Mode**
**Problem:** No voice command for dark mode toggle.

**Solution:**
- Added "dark mode" voice command recognition
- Added `handleDarkModeToggle()` method to toggle dark mode via voice
- Updated command suggestions to include dark mode

## 🎯 Key Improvements Made

### 1. **Better Feature Display Logic**
```javascript
// Now only shows enabled features
const enabledFeatures = preferences[category].filter(feature => feature.enabled);
```

### 2. **Enhanced Error Handling**
```javascript
// Detailed microphone error messages
switch(error.name) {
    case 'NotAllowedError':
        errorMessage = 'Microphone permission denied. Please click the microphone icon in your browser address bar and allow access.';
        break;
    case 'NotFoundError':
        errorMessage = 'No microphone found. Please check your microphone connection.';
        break;
    // ... more cases
}
```

### 3. **Real-time Transcript Display**
```javascript
// Shows what user is saying in real-time
this.recognition.interimResults = true;
this.showTranscript(interimTranscript || finalTranscript);
```

### 4. **Voice Command for Dark Mode**
```javascript
// Added dark mode voice command
if (transcript.includes('dark mode') || transcript.includes('darkmode')) {
    this.handleDarkModeToggle();
}
```

## 🚀 Testing Instructions

### 1. **Test Accessibility Features Display**
1. Load the extension in Chrome
2. Complete the onboarding questionnaire
3. Select some accessibility features
4. Open the popup - you should see only enabled features

### 2. **Test Microphone Access**
1. Open the extension popup
2. Click "Click to Speak"
3. Allow microphone access when prompted
4. You should see real-time transcript as you speak

### 3. **Test Voice Commands**
Try these voice commands:
- "Dark mode" - toggles dark mode
- "Buy paracetamol from Apollo Pharmacy" - opens Apollo with search
- "Turn on high contrast mode" - enables high contrast
- "Increase font size" - makes text larger

## 🔍 Debugging Steps

### If Features Don't Display:
1. Open Chrome DevTools (F12)
2. Go to popup.html
3. Check console for errors
4. Run in console: `chrome.storage.local.get(['accessibilityPreferences'], console.log)`

### If Microphone Doesn't Work:
1. Check if browser supports Web Speech API
2. Check microphone permissions in browser settings
3. Test with `navigator.mediaDevices.getUserMedia({audio: true})`

### If Voice Commands Don't Work:
1. Check console for "Voice command received:" messages
2. Verify the command text matches the patterns in `processVoiceCommand()`
3. Test with simpler commands first

## 📱 Browser Compatibility

- **Chrome**: Full support ✅
- **Edge**: Full support ✅
- **Firefox**: Limited (no Web Speech API) ❌
- **Safari**: Limited (no Web Speech API) ❌

## 🛠️ Development Tips

### 1. **Adding New Voice Commands**
```javascript
// Add to processVoiceCommand() method
else if (transcript.includes('your command')) {
    this.handleYourCommand();
}
```

### 2. **Adding New Accessibility Features**
1. Add to questionnaire.html
2. Add to questionnaire.js feature definitions
3. Add handler in content.js
4. Test with voice commands

### 3. **Debugging Storage Issues**
```javascript
// Check what's stored
chrome.storage.local.get(null, console.log);

// Clear storage
chrome.storage.local.clear();
```

## 🎨 UI/UX Improvements

### New CSS Classes Added:
- `.transcript-container` - Real-time transcript display
- `.manage-features-btn` - Easy access to settings
- `.microphone-help` - Helpful command suggestions
- `.voice-status.listening` - Visual feedback for listening state

### Visual Feedback:
- 🔴 Red microphone icon when listening
- ⚡ Lightning bolt when processing
- 🎙️ Microphone icon when idle
- Real-time transcript in blue box

## 📋 Manifest.json - No Changes Needed

The current manifest.json already has all required permissions:
- `activeTab` - for content script communication
- `storage` - for saving preferences
- `scripting` - for injecting scripts

No additional microphone permissions needed as Web Speech API uses built-in browser permissions.

## 🔄 Next Steps

1. Test the extension with different accessibility needs
2. Add more voice commands based on user feedback
3. Improve error handling for edge cases
4. Add keyboard shortcuts for quick access
5. Consider adding voice feedback for actions

## 📞 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Features not showing | Complete questionnaire first |
| Microphone not working | Enable permissions in browser |
| Voice commands not recognized | Speak clearly, check console |
| Dark mode not toggling | Ensure content script is loaded |
| Storage issues | Clear chrome.storage.local and retry |