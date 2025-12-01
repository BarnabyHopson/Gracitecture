'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface UploadAnalyzeProps {
  onBack: () => void
}

export default function UploadAnalyze({ onBack }: UploadAnalyzeProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [initialAnalysis, setInitialAnalysis] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        setInitialAnalysis(null)
        setMessages([])
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInitialAnalysis = async () => {
    if (!selectedImage || isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          image: selectedImage,
          isInitial: true
        }),
      })

      const data = await response.json()
      setInitialAnalysis(data.analysis)
    } catch (error) {
      console.error('Analysis failed:', error)
      setInitialAnalysis('Sorry, analysis failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedImage || isLoading) return

    const userMessage = inputValue.trim()
    setInputValue('')
    
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          image: selectedImage,
          messages: newMessages,
          initialAnalysis: initialAnalysis
        }),
      })

      const data = await response.json()
      setMessages([...newMessages, { role: 'assistant', content: data.analysis }])
    } catch (error) {
      console.error('Response failed:', error)
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Sorry, I had trouble responding. Could you try again?' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen flex flex-col p-8">
      <div className="mb-4">
        <button
          onClick={onBack}
          className="text-ochre hover:text-fire-red font-semibold text-lg"
        >
          ← Back to Home
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl font-bold text-center mb-8 text-fire-red">
            Analyze a Building
          </h1>

          <div className="bg-ivory p-8 rounded-lg shadow-xl">
            {!selectedImage ? (
              <div className="border-4 border-dashed border-ochre rounded-lg p-12 text-center">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="mb-4">
                    <svg
                      className="mx-auto h-24 w-24 text-ochre"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-gray-500">PNG, JPG up to 10MB</p>
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
                </label>
              </div>
            ) : (
              <div>
                <div className="relative w-full h-96 mb-6 bg-gray-200 rounded overflow-hidden">
                  <Image
                    src={selectedImage}
                    alt="Uploaded building"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>

                {!initialAnalysis ? (
                  <div className="flex gap-4">
                    <button
                      onClick={handleInitialAnalysis}
                      disabled={isLoading}
                      className="flex-1 bg-burnt-orange hover:bg-fire-red text-ivory py-4 px-6 rounded-lg text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Analyzing...' : 'Analyze Building'}
                    </button>
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="bg-ochre hover:bg-burnt-orange text-ivory py-4 px-6 rounded-lg text-lg font-semibold transition-colors"
                    >
                      Upload Different Image
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Initial Analysis */}
                    <div className="p-6 bg-warm-cream rounded-lg border-2 border-ochre mb-6">
                      <h2 className="text-2xl font-bold text-fire-red mb-4">Analysis</h2>
                      <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {initialAnalysis}
                        </p>
                      </div>
                    </div>

                    {/* Follow-up Chat */}
                    <div className="border-t-2 border-ochre pt-6">
                      <h3 className="text-xl font-bold text-fire-red mb-4">Ask Follow-up Questions</h3>
                      
                      {/* Messages */}
                      {messages.length > 0 && (
                        <div className="mb-4 space-y-3 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded">
                          {messages.map((message, idx) => (
                            <div
                              key={idx}
                              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] p-3 rounded-lg ${
                                  message.role === 'user'
                                    ? 'bg-burnt-orange text-ivory'
                                    : 'bg-white text-gray-800 border border-ochre'
                                }`}
                              >
                                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask about materials, history, similar buildings..."
                          disabled={isLoading}
                          className="flex-1 px-4 py-3 border-2 border-ochre rounded-lg focus:outline-none focus:border-burnt-orange disabled:opacity-50"
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={isLoading || !inputValue.trim()}
                          className="bg-burnt-orange hover:bg-fire-red text-ivory px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? '...' : 'Send'}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedImage(null)
                        setInitialAnalysis(null)
                        setMessages([])
                      }}
                      className="mt-6 w-full bg-ochre hover:bg-burnt-orange text-ivory py-3 px-6 rounded-lg font-semibold transition-colors"
                    >
                      Analyze Different Building
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 p-6 bg-ochre/10 rounded-lg border-2 border-ochre">
            <h3 className="text-lg font-bold text-fire-red mb-2">Tips for best results:</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Clear, well-lit photos work best</li>
              <li>• Include the full facade when possible</li>
              <li>• Distinctive architectural features help with identification</li>
              <li>• Ask follow-up questions to dive deeper into specific aspects</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
