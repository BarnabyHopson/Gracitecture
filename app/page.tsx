'use client'

import { useState } from 'react'
import Quiz from '@/components/Quiz'
import UploadAnalyze from '@/components/UploadAnalyze'
import Footer from '@/components/Footer'

export default function Home() {
  const [mode, setMode] = useState<'select' | 'quiz' | 'upload'>('select')

  if (mode === 'quiz') {
    return <Quiz onBack={() => setMode('select')} />
  }

  if (mode === 'upload') {
    return <UploadAnalyze onBack={() => setMode('select')} />
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-6xl font-bold text-center mb-4 text-fire-red">
          Gracitecture
        </h1>
        <p className="text-xl text-center mb-12 text-ochre">
          Learn architecture and architectural engineering principles through visual and conceptual analysis
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <button
            onClick={() => setMode('quiz')}
            className="bg-burnt-orange hover:bg-fire-red text-ivory p-12 rounded-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            <h2 className="text-3xl font-bold mb-4">Quiz Mode</h2>
            <p className="text-lg">
              Test your knowledge with curated examples. Learn architectural styles and structural principles.
            </p>
          </button>

          <button
            onClick={() => setMode('upload')}
            className="bg-ochre hover:bg-burnt-orange text-ivory p-12 rounded-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            <h2 className="text-3xl font-bold mb-4">Analyze Building</h2>
            <p className="text-lg">
              Upload a photo of any building and discover its architectural features and structural systems.
            </p>
          </button>
        </div>

        <div className="mt-16 text-center text-base text-ochre">
          <p>Built for architecture students and curious minds</p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
