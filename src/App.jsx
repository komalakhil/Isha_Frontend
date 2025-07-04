import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Send, Sparkles, Brain, Zap } from 'lucide-react'
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
  
  const mediaRecorderRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    // Hide welcome screen after 3 seconds
    const timer = setTimeout(() => setShowWelcome(false), 3000)
    return () => clearTimeout(timer)
  }, [])

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
          const response = await fetch('http://localhost:5000/chat', {
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
            const aiResponse = {
              id: data.message_id || Date.now() + 1,
              text: data.response,
              sender: 'isha',
              timestamp: new Date(data.timestamp)
            }
            setMessages(prev => [...prev, aiResponse])
          } else {
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
            <motion.div
              className="avatar"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Brain size={24} />
            </motion.div>
            <div className="header-text">
              <h2>Isha</h2>
              <p>Professional AI Assistant</p>
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
