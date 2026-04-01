import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "🚌 Welcome to Kerala Bus AI! I'm your intelligent travel assistant for KSRTC buses.\n\nHow can I help you today? You can ask me about:\n• Bus routes between cities\n• Schedules and timings\n• Best routes for your trip\n• Multi-city itineraries\n\nJust tell me where you want to go!",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const quickActions = [
    { label: '🏢 Going to work', query: 'I need to go to work, suggest daily commuter routes' },
    { label: '🗺️ Planning a trip', query: 'I want to plan a tourist trip in Kerala' },
    { label: '🚨 Emergency travel', query: 'I need urgent travel assistance' },
    { label: '💰 Budget travel', query: 'Show me the cheapest bus options' }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text = inputValue) => {
    if (!text.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: text.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        message: text.trim(),
        conversationHistory: messages.slice(-10)
      })

      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: response.data.response,
        routes: response.data.routes,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      
      // Fallback response for demo
      const demoResponse = generateDemoResponse(text.trim())
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: demoResponse.text,
        routes: demoResponse.routes,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateDemoResponse = (message) => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('kollam') && lowerMessage.includes('kochi')) {
      return {
        text: "Perfect! Here are the best bus options from Kollam to Kochi:",
        routes: [
          {
            name: 'Super Fast AC',
            departure: '08:15 AM',
            arrival: '10:45 AM',
            duration: '2h 30m',
            fare: 145,
            seats: 12,
            type: 'AC',
            recommended: true
          },
          {
            name: 'Fast Passenger',
            departure: '07:45 AM',
            arrival: '11:00 AM',
            duration: '3h 15m',
            fare: 120,
            seats: 25,
            type: 'Non-AC',
            recommended: false
          }
        ]
      }
    }
    
    if (lowerMessage.includes('trivandrum') || lowerMessage.includes('thiruvananthapuram')) {
      return {
        text: "Here are buses to Trivandrum:",
        routes: [
          {
            name: 'Trivandrum Express',
            departure: '06:00 AM',
            arrival: '09:30 AM',
            duration: '3h 30m',
            fare: 180,
            seats: 8,
            type: 'AC',
            recommended: true
          }
        ]
      }
    }

    if (lowerMessage.includes('munnar')) {
      return {
        text: "Great choice! Munnar is beautiful. Here are your options:",
        routes: [
          {
            name: 'Munnar Hill Station Special',
            departure: '07:00 AM',
            arrival: '11:30 AM',
            duration: '4h 30m',
            fare: 220,
            seats: 15,
            type: 'AC',
            recommended: true
          }
        ]
      }
    }

    return {
      text: `Thank you for your query: "${message}"\n\nI can help you with KSRTC bus routes, schedules, and travel planning. Please tell me:\n• Where are you traveling from?\n• Where do you want to go?\n• When do you want to travel?\n• Any preferences (AC, budget, fastest)?`,
      routes: []
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      {/* Header */}
      <header className="bg-white shadow-lg p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-ksrtc-primary to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              🚌
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Kerala Bus AI</h1>
              <p className="text-sm text-gray-600">Your KSRTC Travel Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Online
            </span>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.text}</p>
              
              {/* Route Cards */}
              {message.routes && message.routes.length > 0 && (
                <div className="mt-4 space-y-3">
                  {message.routes.map((route, idx) => (
                    <div
                      key={idx}
                      className={`border-2 rounded-xl p-4 transition-all hover:shadow-lg ${
                        route.recommended 
                          ? 'border-ksrtc-primary bg-orange-50' 
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg flex items-center">
                            {route.name}
                            {route.recommended && (
                              <span className="ml-2 px-2 py-0.5 bg-ksrtc-primary text-white text-xs rounded-full">
                                ⭐ Recommended
                              </span>
                            )}
                          </h3>
                          <span className={`inline-block px-2 py-1 text-xs rounded mt-1 ${
                            route.type === 'AC' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {route.type}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-ksrtc-secondary">₹{route.fare}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                        <div>
                          <p className="text-gray-500">Departure</p>
                          <p className="font-semibold">{route.departure}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Arrival</p>
                          <p className="font-semibold">{route.arrival}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Duration</p>
                          <p className="font-semibold">{route.duration}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3 pt-3 border-t">
                        <p className="text-sm text-gray-600">
                          🎫 {route.seats} seats available
                        </p>
                        <button className="px-4 py-2 bg-ksrtc-primary text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <p className={`text-xs mt-2 ${
                message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-md">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 bg-white/90 backdrop-blur-sm">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(action.query)}
              className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-full text-sm whitespace-nowrap hover:from-blue-100 hover:to-purple-100 transition-all border border-gray-200"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        <div className="flex space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your travel query... (e.g., 'I need to go from Kollam to Kochi tomorrow morning')"
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-ksrtc-primary to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
