import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Send, Sparkles, Brain, Zap } from 'lucide-react'
import { getApiEndpoint } from './api.js'
import './App.css'

function App() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm Isha, your professional AI assistant. Hold the mic button to speak with me!", sender: 'isha', timestamp: new Date() }
  ])
  const [isRecording, setIsRecording] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [showWelcome, setShowWelcome] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voicesLoaded, setVoicesLoaded] = useState(false)
  
  const mediaRecorderRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const animationFrameRef = useRef(null)
  const speechSynthesisRef = useRef(null)
  const availableVoicesRef = useRef([])

  useEffect(() => {
    // Hide welcome screen after 3 seconds
    const timer = setTimeout(() => setShowWelcome(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices()
      availableVoicesRef.current = voices
      setVoicesLoaded(true)
      console.log('Voices loaded:', voices.length)
      voices.forEach(voice => {
        console.log(`Voice: ${voice.name} (${voice.lang})`)
      })
    }

    // Load voices immediately if available
    loadVoices()

    // Listen for voice changes (some browsers load voices asynchronously)
    const handleVoicesChanged = () => {
      loadVoices()
    }

    speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged)

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged)
    }
  }, [])

  // Speak welcome message when voices are loaded and welcome screen is hidden
  useEffect(() => {
    if (voicesLoaded && !showWelcome) {
      const timer = setTimeout(() => {
        speakText("Hello! I'm Isha, your professional AI assistant. Hold the mic button to speak with me!")
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [voicesLoaded, showWelcome])

  // Test TTS function
  const testTTS = () => {
    speakText("Hello! This is a test of the text-to-speech functionality. I am Isha, your AI assistant, and I can speak to you!")
  }

  // Enhanced text-to-speech function
  const speakText = (text) => {
    console.log('Speaking text:', text)
    
    // Cancel any ongoing speech
    if (speechSynthesisRef.current) {
      speechSynthesis.cancel()
    }

    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported')
      return
    }

    setIsSpeaking(true)
    
    const utterance = new SpeechSynthesisUtterance(text)
    
    // Configure voice settings
    utterance.rate = 0.9
    utterance.pitch = 1.1
    utterance.volume = 0.8
    
    // Get available voices
    const voices = availableVoicesRef.current.length > 0 
      ? availableVoicesRef.current 
      : speechSynthesis.getVoices()
    
    console.log('Available voices:', voices.length)
    
    // Try to find a suitable voice (prefer female voices)
    const preferredVoices = [
      'Google US English Female',
      'Microsoft Zira - English (United States)',
      'Samantha',
      'Karen',
      'Victoria',
      'Susan',
      'Alex',
      'Google UK English Female'
    ]
    
    let selectedVoice = null
    
    // First try to find preferred voices
    for (const preferredName of preferredVoices) {
      selectedVoice = voices.find(voice => 
        voice.name.toLowerCase().includes(preferredName.toLowerCase())
      )
      if (selectedVoice) break
    }
    
    // If no preferred voice found, try to find any female voice
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('victoria') ||
        voice.name.toLowerCase().includes('susan')
      )
    }
    
    // If still no voice found, use the first available English voice
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.lang.startsWith('en')
      )
    }
    
    // If still no voice, use the first available voice
    if (!selectedVoice && voices.length > 0) {
      selectedVoice = voices[0]
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice
      console.log('Selected voice:', selectedVoice.name)
    } else {
      console.log('No voice selected, using default')
    }
    
    utterance.onstart = () => {
      console.log('Speech started')
      setIsSpeaking(true)
    }
    
    utterance.onend = () => {
      console.log('Speech ended')
      setIsSpeaking(false)
      speechSynthesisRef.current = null
    }
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error)
      setIsSpeaking(false)
      speechSynthesisRef.current = null
      
      // Try to restart speech synthesis on error
      if (event.error === 'interrupted' || event.error === 'canceled') {
        console.log('Retrying speech synthesis...')
        setTimeout(() => {
          speakText(text)
        }, 100)
      }
    }
    
    speechSynthesisRef.current = utterance
    
    // For some browsers, we need to call speak() after a small delay
    setTimeout(() => {
      try {
        speechSynthesis.speak(utterance)
        console.log('Speech synthesis started')
      } catch (error) {
        console.error('Error starting speech synthesis:', error)
        setIsSpeaking(false)
      }
    }, 100)
  }

  // Function to stop speaking
  const stopSpeaking = () => {
    console.log('Stopping speech')
    if (speechSynthesisRef.current) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
      speechSynthesisRef.current = null
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Setup audio context for visualization
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      
      analyserRef.current.fftSize = 256
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      
      const updateAudioLevel = () => {
        analyserRef.current.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b) / bufferLength
        setAudioLevel(average / 255)
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
      }
      updateAudioLevel()

      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.start()
      setIsRecording(true)
      setIsListening(true)
      
      // Simulate speech recognition (replace with actual implementation)
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'
      
      recognition.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('')
        setTranscript(currentTranscript)
      }
      
      recognition.start()
      
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Please allow microphone access to use voice features')
    }
  }

  const stopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsListening(false)
      setAudioLevel(0)
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      
      // Add user message if there's a transcript
      if (transcript.trim()) {
        const userMessage = {
          id: Date.now(),
          text: transcript,
          sender: 'user',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, userMessage])
        
        // Send message to backend
        try {
          console.log('Sending message to backend:', transcript)
          const response = await fetch(getApiEndpoint('chat'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: transcript,
              user_name: 'User',
              conversation_history: messages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text,
                timestamp: msg.timestamp.toISOString(),
                message_id: msg.id.toString()
              }))
            })
          })
          
          if (response.ok) {
            const data = await response.json()
            console.log('Received response from backend:', data)
            const aiResponse = {
              id: data.message_id || Date.now() + 1,
              text: data.response,
              sender: 'isha',
              timestamp: new Date(data.timestamp)
            }
            setMessages(prev => [...prev, aiResponse])
            
            // Speak the AI response
            console.log('About to speak AI response')
            speakText(data.response)
          } else {
            console.error('Backend response not ok:', response.status)
            throw new Error('Failed to get response from backend')
          }
        } catch (error) {
          console.error('Error sending message to backend:', error)
          // Fallback response
          const fallbackResponse = {
            id: Date.now() + 1,
            text: `I'm replying to your message! I heard you say: "${transcript}". I'm currently having trouble connecting to my backend services, but I'm still here to help! This is a demo of voice interaction with your AI assistant Isha.`,
            sender: 'isha',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, fallbackResponse])
          
          // Speak the fallback response
          console.log('About to speak fallback response')
          speakText(fallbackResponse.text)
        }
        
        setTranscript('')
      }
    }
  }

  const floatingElements = Array.from({ length: 6 }, (_, i) => (
    <motion.div
      key={i}
      className="floating-element"
      initial={{ opacity: 0, y: 100 }}
      animate={{ 
        opacity: [0.3, 0.6, 0.3],
        y: [100, -100, 100],
        x: [0, Math.random() * 100 - 50, 0]
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        repeat: Infinity,
        delay: i * 0.5
      }}
    >
      {i % 3 === 0 ? <Sparkles /> : i % 3 === 1 ? <Brain /> : <Zap />}
    </motion.div>
  ))

  return (
    <div className="app">
      <div className="background-elements">
        {floatingElements}
      </div>
      
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="welcome-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="welcome-content"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            >
              <motion.div
                className="logo"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Brain size={60} />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                ISHA
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Your Professional AI Assistant
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="chat-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: showWelcome ? 0 : 1, y: showWelcome ? 50 : 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <motion.header
          className="chat-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="header-content">
            <div className="header-left">
              <motion.div
                className={`avatar ${isSpeaking ? 'speaking' : ''}`}
                whileHover={{ scale: 1.1 }}
                animate={isSpeaking ? {
                  scale: [1, 1.1, 1],
                  rotate: [0, 2, -2, 0]
                } : {}}
                transition={{ 
                  type: "spring", 
                  stiffness: 300,
                  duration: 0.8,
                  repeat: isSpeaking ? Infinity : 0
                }}
              >
                <Brain size={24} />
              </motion.div>
              <div className="header-text">
                <h2>Isha</h2>
                <p>
                  {isSpeaking ? 'Speaking...' : 'Professional AI Assistant'}
                </p>
              </div>
            </div>
            <div className="header-buttons">
              {isSpeaking && (
                <motion.button
                  className="stop-speaking-btn"
                  onClick={stopSpeaking}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  Stop
                </motion.button>
              )}
              <motion.button
                className="test-tts-btn"
                onClick={testTTS}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Test Text-to-Speech"
              >
                🔊
              </motion.button>
            </div>
          </div>
        </motion.header>

        <div className="messages-container">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`message ${message.sender}`}
                initial={{ opacity: 0, x: message.sender === 'user' ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: message.sender === 'user' ? 50 : -50 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="timestamp">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          className="input-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="input-wrapper">
            <motion.div
              className="transcript-display"
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: transcript ? 1 : 0, 
                height: transcript ? 'auto' : 0 
              }}
              transition={{ duration: 0.3 }}
            >
              {transcript && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {transcript}
                </motion.p>
              )}
            </motion.div>
            
            <motion.button
              className={`mic-button ${isListening ? 'listening' : ''}`}
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isListening ? {
                boxShadow: [
                  '0 0 20px rgba(59, 130, 246, 0.5)',
                  '0 0 40px rgba(59, 130, 246, 0.8)',
                  '0 0 20px rgba(59, 130, 246, 0.5)'
                ]
              } : {}}
              transition={{ duration: 0.8, repeat: isListening ? Infinity : 0 }}
            >
              <motion.div
                className="mic-icon"
                animate={isListening ? { 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                } : { scale: 1 }}
                transition={{ duration: 0.6, repeat: isListening ? Infinity : 0 }}
              >
                {isListening ? <Mic size={24} /> : <MicOff size={24} />}
              </motion.div>
              
              <motion.div
                className="audio-visualizer"
                initial={{ scale: 0 }}
                animate={{ 
                  scale: isListening ? 1 : 0,
                  opacity: isListening ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="audio-bar"
                    animate={isListening ? {
                      scaleY: [0.3, audioLevel * 2 + 0.5, 0.3]
                    } : { scaleY: 0.3 }}
                    transition={{
                      duration: 0.2,
                      delay: i * 0.05,
                      repeat: isListening ? Infinity : 0
                    }}
                  />
                ))}
              </motion.div>
            </motion.button>
            
            <motion.p
              className="mic-instructions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              Hold to speak with Isha
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default App
