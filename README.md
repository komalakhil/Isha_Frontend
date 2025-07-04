# Isha - Professional AI Assistant 🤖

A modern, voice-enabled AI assistant built with React and Framer Motion, featuring stunning animations and microphone integration.

## ✨ Features

### 🎙️ Voice Integration
- **Hold-to-Speak**: Press and hold the microphone button to record your voice
- **Real-time Transcription**: See your speech converted to text in real-time
- **Audio Visualization**: Beautiful audio level visualization while speaking
- **Web Speech API**: Uses browser's native speech recognition

### 🎨 Modern Design
- **Glassmorphism UI**: Beautiful translucent interface with backdrop blur
- **Gradient Themes**: Stunning gradient backgrounds and message bubbles
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Light Mode**: Professional light theme optimized for productivity

### 🎭 Framer Motion Animations
- **Welcome Screen**: Animated logo and text with spring transitions
- **Floating Elements**: Background particles with continuous motion
- **Message Animations**: Smooth slide-in animations for conversations
- **Button Interactions**: Hover and tap animations with scaling effects
- **Audio Pulse**: Pulsing animation when microphone is active

### 🚀 Technical Features
- **Vite + React**: Lightning-fast development and build
- **Modern JavaScript**: Uses latest ES6+ features and React hooks
- **Accessibility**: Full keyboard navigation and screen reader support
- **Performance**: Optimized animations and efficient re-renders

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`
   - Allow microphone permissions when prompted

## 🎯 Usage

### Basic Interaction
1. **Welcome Screen**: The app starts with an animated welcome screen featuring the Isha logo
2. **Chat Interface**: After 3 seconds, the main chat interface appears
3. **Voice Input**: Hold the microphone button to start recording
4. **Speech Recognition**: Your speech is transcribed in real-time
5. **AI Response**: Release the button to send your message and receive a response

### Microphone Controls
- **Hold**: Press and hold the mic button to start recording
- **Release**: Release to stop recording and send the message
- **Visual Feedback**: The button changes color and pulses while recording
- **Audio Bars**: Real-time audio level visualization

### Responsive Design
- **Desktop**: Full-featured experience with larger elements
- **Tablet**: Optimized layout with medium-sized components
- **Mobile**: Compact design with touch-friendly controls

## 🔧 Configuration

### Environment Variables
```env
# Add these to your .env file if needed
VITE_API_URL=your-api-endpoint
VITE_SPEECH_API_KEY=your-speech-api-key
```

### Customization
- **Colors**: Edit CSS variables in `src/App.css`
- **Animations**: Modify Framer Motion configurations in `src/App.jsx`
- **Messages**: Customize AI responses in the `stopRecording` function

## 🎨 Styling

### CSS Variables
```css
:root {
  --bg-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --bg-message-user: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --bg-message-isha: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  /* ... more variables */
}
```

### Animation Configurations
```javascript
// Framer Motion variants
const messageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
}
```

## 🔊 Audio Features

### Speech Recognition
- **Language**: English (US) by default
- **Continuous**: Real-time transcription while speaking
- **Interim Results**: Shows partial results as you speak

### Audio Visualization
- **Audio Context**: Uses Web Audio API for visualization
- **Frequency Analysis**: Real-time audio frequency data
- **Visual Bars**: Animated bars that respond to audio levels

## 📱 Browser Support

### Required Features
- **Web Speech API**: For voice recognition
- **Web Audio API**: For audio visualization
- **MediaDevices API**: For microphone access

### Supported Browsers
- ✅ Chrome/Chromium 25+
- ✅ Edge 79+
- ✅ Firefox 44+
- ✅ Safari 14.1+

## 🚀 Performance

### Optimization Features
- **Lazy Loading**: Components load only when needed
- **Animation Optimization**: Uses transform and opacity for smooth animations
- **Memory Management**: Proper cleanup of audio contexts and timers
- **Efficient Re-renders**: Optimized React state updates

### Best Practices
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Security**: Secure microphone permission handling
- **Error Handling**: Graceful fallbacks for unsupported features

## 🔐 Security & Privacy

### Microphone Access
- **Permission Required**: Requests user permission before accessing microphone
- **Secure Context**: Only works on HTTPS or localhost
- **No Storage**: Audio is processed locally, not stored

### Data Privacy
- **Local Processing**: Speech recognition happens in the browser
- **No External Calls**: Demo mode doesn't send data to external servers
- **User Control**: Users can deny microphone access at any time

## 🎯 Future Enhancements

### Planned Features
- [ ] Integration with real AI services (OpenAI, etc.)
- [ ] Multiple language support
- [ ] Voice synthesis for AI responses
- [ ] Dark mode toggle
- [ ] Chat history persistence
- [ ] Export conversation feature

### Technical Improvements
- [ ] WebRTC for better audio quality
- [ ] PWA support for offline usage
- [ ] Real-time collaboration features
- [ ] Advanced audio processing

## 🐛 Troubleshooting

### Common Issues

1. **Microphone Not Working**
   - Check browser permissions
   - Ensure HTTPS or localhost
   - Try refreshing the page

2. **Speech Recognition Errors**
   - Check browser compatibility
   - Ensure stable internet connection
   - Try speaking more clearly

3. **Animation Performance**
   - Reduce motion in accessibility settings
   - Close other resource-intensive tabs
   - Update your browser

### Debug Mode
Add `?debug=true` to the URL to enable debug logging:
```
http://localhost:5173?debug=true
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👏 Acknowledgments

- **Framer Motion**: For incredible animation capabilities
- **Lucide React**: For beautiful, consistent icons
- **Vite**: For blazing fast development experience
- **React**: For the robust component framework

---

**Made with ❤️ for modern web experiences**

*Isha - Your Professional AI Assistant*
