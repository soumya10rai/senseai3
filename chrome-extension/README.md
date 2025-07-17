# BetterWeb - Chrome Extension

A personalized accessibility assistant for users with different disabilities.

## Features

### 🧿 Visual Disabilities Support
- Increase Font Size
- Increase Contrast
- Enable Text-to-Speech (click any text to hear it)
- Zoom Tool
- Cursor Size Enhancer
- Screen Reader Labels
- Colorblind Mode
- Line Highlighting
- Text Magnifier
- Reduce Animation

### 🔡 Dyslexia / Learning Disabilities
- OpenDyslexic/Clear Sans Font
- Adjust Letter Spacing
- Increase Line Spacing
- Syllable Highlighting
- Reading Ruler (follows mouse cursor)
- Background Tint

### 🧠 ADHD / Focus Needs
- Larger Fonts
- Minimal UI / Focus Mode
- Hide Distractions (ads/images)
- Sound Feedback for tasks
- Task Chunking UI

### 🌙 Photosensitivity
- Always use Dark Mode
- Reduce Bright Colors
- Block Flash Animations

### 🧩 Neuro-Cognitive
- Reduce Brightness
- High Structure Layout
- Soft Color Contrast
- Fewer Animations

### 🎙️ Voice Assistant
- Click-to-speak functionality
- Voice commands for shopping:
  - "Buy me paracetamol from Apollo Pharmacy"
  - "Show me sanitary pads on Amazon"
- Voice commands for accessibility:
  - "Increase font size"
  - "Enable dark mode"
  - "Turn on high contrast mode"

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the `chrome-extension` folder
5. The BetterWeb extension will now be installed

## First Use

1. Click the BetterWeb extension icon in Chrome
2. Complete the onboarding process:
   - Enter your basic information
   - Select your accessibility needs from the questionnaire
3. Your preferences will be saved and the extension will be ready to use

## Usage

### Popup Interface
- Click the extension icon to open the popup
- Use the voice assistant by clicking "Click to Speak"
- Toggle individual accessibility features on/off
- Use quick actions for common tasks

### Voice Commands
- **Shopping**: "Buy [product] from [Apollo Pharmacy/Amazon/Flipkart]"
- **Search**: "Show me [product] on [Amazon/Flipkart]"
- **Accessibility**: "Turn on [feature name]"

### Settings
- Click the settings gear icon to modify your preferences
- Re-run the questionnaire to add or remove features

## Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- Voice commands are processed locally using Web Speech API

## Technical Details

- **Manifest Version**: 3
- **Permissions**: activeTab, storage, scripting
- **Technologies**: Vanilla JavaScript, HTML5, CSS3, Web Speech API
- **Storage**: Chrome's local storage API

## File Structure

```
chrome-extension/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── onboarding.html       # Initial setup page
├── onboarding.js         # Onboarding logic
├── questionnaire.html    # Accessibility preferences
├── questionnaire.js      # Questionnaire logic
├── voiceAssistant.js     # Voice recognition and commands
├── content.js            # Content script for web pages
├── content.css           # Styles injected into web pages
├── style.css             # Extension UI styles
└── icons/                # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Development

To modify the extension:

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh button on the BetterWeb extension
4. Test your changes

## Support

For support or feature requests, please refer to the extension's documentation or contact the development team.

## Version History

- **v1.0**: Initial release with full accessibility features and voice assistant