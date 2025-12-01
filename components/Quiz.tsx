'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import buildingsData from '@/data/buildings.json'

interface Building {
  id: string
  name: string
  image_url: string
  style: string
  style_distractors: string[]
  era: string
  style_explanation: string
  engineering_question: string
  engineering_answer: string
  engineering_distractors: string[]
  engineering_explanation: string
  fun_facts: string[]
  difficulty: string
}

interface QuizProps {
  onBack: () => void
}

type QuizStage = 'style-question' | 'style-answer' | 'engineering-question' | 'engineering-answer' | 'complete'

const getStyleHint = (style: string): string => {
  const hints: Record<string, string> = {
    'Gothic': 'Pointed arches, flying buttresses, ribbed vaults, vertical emphasis, large stained glass windows',
    'Ancient Greek': 'Columns (Doric, Ionic, Corinthian), pediments, symmetry, temples, marble construction',
    'Ancient Roman': 'Arches, concrete, domes, vaults, aqueducts, amphitheaters, engineering innovation',
    'Renaissance': 'Classical revival, symmetry, proportion, domes, columns, human-centered design',
    'Baroque': 'Dramatic curves, ornate decoration, gilding, theatrical lighting, emotional intensity',
    'Islamic': 'Domes, minarets, geometric patterns, calligraphy, courtyards, horseshoe arches',
    'Byzantine': 'Large domes, mosaics, pendentives, rich colors, centralized plans, religious focus',
    'Romanesque': 'Round arches, thick walls, small windows, barrel vaults, fortress-like, heavy appearance',
    'Art Nouveau': 'Organic forms, flowing lines, nature motifs, curved shapes, decorative ironwork',
    'Art Deco': 'Geometric patterns, streamlined forms, zigzags, chrome, symmetry, luxury materials',
    'Modernist': 'Function over form, flat roofs, open plans, glass walls, minimal decoration, steel/concrete',
    'Brutalist': 'Raw concrete, massive forms, repetitive modules, fortress-like, honest materials',
    'Neoclassical': 'Greek/Roman revival, columns, pediments, symmetry, grandeur, civic buildings',
    'Contemporary': 'Innovative forms, sustainable materials, technology integration, experimental structures',
    // Distractors
    'Neo-Gothic': 'Gothic revival from 19th century, pointed arches, elaborate tracery, romantic medievalism',
    'Norman': 'Early English Romanesque, round arches, thick walls, castle-like towers',
    'Hellenistic': 'Later Greek period, more ornate than Classical, larger scale, dramatic poses',
    'Corinthian': 'Most ornate Greek order, elaborate capitals with acanthus leaves',
    'Doric': 'Simplest Greek order, sturdy columns, no base, plain capitals',
    'Ionic': 'Greek order with scroll capitals (volutes), more slender than Doric',
    'Perpendicular Gothic': 'Late English Gothic, vertical lines, fan vaults, large windows',
    'Early Gothic': 'Transitional period, early pointed arches, less elaborate than High Gothic',
    'High Gothic': 'Peak Gothic period, soaring height, elaborate decoration, structural innovation',
    'Mannerist': 'Between Renaissance & Baroque, rule-breaking, elongated forms, complex',
    'Rococo': 'Late Baroque, lighter, more playful, pastel colors, asymmetrical curves',
    'Palladian': 'Based on Palladio works, symmetrical villas, classical proportions',
    'Gothic Revival': '19th century revival of Gothic, romantic, ecclesiastical focus',
    'Augustan': 'Roman classical style from Augustus era, imperial grandeur',
    'Etruscan': 'Pre-Roman Italian, arches, terracotta decoration',
    'Imperial': 'Roman imperial period, monumental scale, engineering prowess',
    'Bauhaus': 'German modernist school, function follows form, clean lines, no ornament',
    'International Style': 'Modernist, glass and steel, flat roofs, no decoration, universal aesthetic',
    'Streamline Moderne': 'Art Deco evolution, aerodynamic curves, horizontal lines, machine aesthetic',
    'Postmodern': 'Reaction to Modernism, historical references, irony, decoration returns',
    'Deconstructivism': 'Fragmented forms, non-rectilinear shapes, visual complexity',
    'High-Tech': 'Exposed structure, industrial materials, technology celebration',
    'Expressionism': 'Emotional forms, distorted shapes, dramatic effects',
    'Functionalist': 'Form follows function, no ornament, practical design',
    'Minimalist': 'Extreme simplicity, essential elements only, pure forms',
    'Metabolist': 'Japanese movement, organic growth, modular megastructures',
    'Neo-Futurism': 'Futuristic curves, advanced technology, dynamic forms',
    'Modernisme': 'Catalan Art Nouveau, organic forms, colorful decoration',
    'Vienna Modern': 'Early 20th century Viennese modernism, simplified classicism',
    'Austrian Baroque': 'Austrian variation, more restrained, lighter colors',
    'Jugendstil': 'German/Austrian Art Nouveau, geometric Art Nouveau',
    'Jugendstil Revival': 'Revival of Jugendstil style',
    'Secession Style': 'Viennese Art Nouveau breakaway movement',
    'Arts and Crafts': 'Handcrafted quality, medieval inspiration, honest materials',
    'Beaux-Arts': 'French classical, grand scale, elaborate decoration, symmetry',
    'Prairie School': 'Frank Lloyd Wright, horizontal lines, open plans, nature integration',
    'Federal Style': 'American neoclassical, delicate details, symmetry',
    'Georgian Colonial': 'Colonial American, symmetrical, brick, classical elements',
    'Greek Revival': 'Pure Greek temple forms, columns, pediments',
    'Victorian': 'Eclectic 19th century, ornate, varied historical styles',
    'Moorish': 'North African Islamic style, horseshoe arches, geometric patterns',
    'Ottoman': 'Turkish Islamic, large domes, pencil minarets',
    'Ottoman Baroque': 'Turkish Baroque fusion, curved forms with Islamic elements',
    'Moorish Revival': '19th century European fantasy of Islamic architecture',
    'Mudejar': 'Spanish Christian-Islamic fusion, brick, geometric decoration',
    'Ottonian': 'Early medieval German, Romanesque precursor',
    'Carolingian': 'Charlemagne era, revival of Roman forms',
    'Empire': 'French Neoclassical under Napoleon, imperial Roman references',
    'Archaic': 'Early Greek period, developing orders, simpler forms',
    'Early English': 'Early Gothic in England, lancet windows, simple forms',
    'Decorated': 'Middle English Gothic, elaborate tracery, flowing curves',
    'Early Christian': 'Roman basilica form adapted for churches',
    'Armenian': 'Armenian Christian, conical domes, stone carving',
  }
  return hints[style] || 'Classic architectural style with distinctive features'
}

export default function Quiz({ onBack }: QuizProps) {
  const [buildings] = useState<Building[]>(() => 
    [...buildingsData as Building[]].sort(() => Math.random() - 0.5)
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [stage, setStage] = useState<QuizStage>('style-question')
  const [styleOptions, setStyleOptions] = useState<string[]>([])
  const [engineeringOptions, setEngineeringOptions] = useState<string[]>([])
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [selectedEngineering, setSelectedEngineering] = useState<string | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [showBuildingName, setShowBuildingName] = useState(false)

  const currentBuilding = buildings[currentIndex]

  useEffect(() => {
    if (currentBuilding) {
      // Shuffle style options
      const shuffledStyles = [...currentBuilding.style_distractors, currentBuilding.style]
        .sort(() => Math.random() - 0.5)
      setStyleOptions(shuffledStyles)

      // Shuffle engineering options
      const shuffledEngineering = [...currentBuilding.engineering_distractors, currentBuilding.engineering_answer]
        .sort(() => Math.random() - 0.5)
      setEngineeringOptions(shuffledEngineering)
    }
  }, [currentIndex, currentBuilding])

  const handleStyleAnswer = (answer: string) => {
    setSelectedStyle(answer)
    setStage('style-answer')
    if (answer === currentBuilding.style) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }))
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }))
    }
  }

  const handleEngineeringAnswer = (answer: string) => {
    setSelectedEngineering(answer)
    setStage('engineering-answer')
    if (answer === currentBuilding.engineering_answer) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }))
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }))
    }
  }

  const handleNext = () => {
    if (currentIndex < buildings.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setStage('style-question')
      setSelectedStyle(null)
      setSelectedEngineering(null)
      setShowBuildingName(false)
    } else {
      setStage('complete')
    }
  }

  const handleContinueToEngineering = () => {
    setStage('engineering-question')
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setStage('style-question')
    setSelectedStyle(null)
    setSelectedEngineering(null)
    setScore({ correct: 0, total: 0 })
    setShowBuildingName(false)
  }

  if (stage === 'complete') {
    const percentage = Math.round((score.correct / score.total) * 100)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-ivory p-12 rounded-lg shadow-xl">
          <h1 className="text-4xl font-bold text-center mb-8 text-fire-red">Quiz Complete!</h1>
          <div className="text-center mb-8">
            <p className="text-6xl font-bold text-ochre mb-4">{percentage}%</p>
            <p className="text-2xl text-gray-700">
              {score.correct} out of {score.total} correct
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleRestart}
              className="flex-1 bg-burnt-orange hover:bg-fire-red text-ivory py-4 px-6 rounded-lg text-lg font-semibold transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-ochre hover:bg-burnt-orange text-ivory py-4 px-6 rounded-lg text-lg font-semibold transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col p-8">
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-ochre hover:text-fire-red font-semibold text-lg"
        >
          ← Back
        </button>
        <div className="text-ochre font-semibold">
          Score: {score.correct}/{score.total} | Building {currentIndex + 1}/{buildings.length}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          {/* Image */}
          <div className="mb-8 bg-white p-4 rounded-lg shadow-lg">
            <div className="relative w-full h-96 bg-gray-200 rounded overflow-hidden">
              <Image
                src={currentBuilding.image_url}
                alt={currentBuilding.name}
                fill
                className="object-cover"
                priority
              />
              {showBuildingName && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white p-4">
                  <p className="text-center font-semibold text-lg">
                    {currentBuilding.name} ({currentBuilding.era})
                  </p>
                </div>
              )}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowBuildingName(!showBuildingName)}
                className="text-ochre hover:text-fire-red font-semibold text-sm underline"
              >
                {showBuildingName ? 'Hide' : 'Reveal'} Building Name
              </button>
            </div>
          </div>

          {/* Style Question */}
          {stage === 'style-question' && (
            <div className="bg-ivory p-8 rounded-lg shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-fire-red">
                What architectural style is this?
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {styleOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleStyleAnswer(option)}
                    className="bg-white hover:bg-burnt-orange hover:text-ivory border-2 border-ochre p-6 rounded-lg text-lg font-semibold transition-all relative group"
                    title={getStyleHint(option)}
                  >
                    {option}
                    <div className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {getStyleHint(option)}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-center mt-4 text-gray-600 text-sm italic">
                (Hover over options for style hints)
              </p>
            </div>
          )}

          {/* Style Answer */}
          {stage === 'style-answer' && (
            <div className="bg-ivory p-8 rounded-lg shadow-xl">
              <div className="mb-6">
                {selectedStyle === currentBuilding.style ? (
                  <h2 className="text-3xl font-bold text-green-600 mb-2">✓ Correct!</h2>
                ) : (
                  <div>
                    <h2 className="text-3xl font-bold text-red-600 mb-2">✗ Incorrect</h2>
                    <p className="text-xl text-gray-700">
                      The correct answer is: <span className="font-bold text-fire-red">{currentBuilding.style}</span>
                    </p>
                  </div>
                )}
              </div>
              <div className="mb-6 p-4 bg-warm-cream rounded">
                <p className="text-gray-700 leading-relaxed">{currentBuilding.style_explanation}</p>
              </div>
              <button
                onClick={handleContinueToEngineering}
                className="w-full bg-burnt-orange hover:bg-fire-red text-ivory py-4 px-6 rounded-lg text-lg font-semibold transition-colors"
              >
                Continue to Engineering Question →
              </button>
            </div>
          )}

          {/* Engineering Question */}
          {stage === 'engineering-question' && (
            <div className="bg-ivory p-8 rounded-lg shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-fire-red">
                {currentBuilding.engineering_question}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {engineeringOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleEngineeringAnswer(option)}
                    className="bg-white hover:bg-burnt-orange hover:text-ivory border-2 border-ochre p-6 rounded-lg text-lg font-semibold transition-all text-left"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Engineering Answer */}
          {stage === 'engineering-answer' && (
            <div className="bg-ivory p-8 rounded-lg shadow-xl">
              <div className="mb-6">
                {selectedEngineering === currentBuilding.engineering_answer ? (
                  <h2 className="text-3xl font-bold text-green-600 mb-2">✓ Correct!</h2>
                ) : (
                  <div>
                    <h2 className="text-3xl font-bold text-red-600 mb-2">✗ Incorrect</h2>
                    <p className="text-xl text-gray-700">
                      The correct answer is: <span className="font-bold text-fire-red">{currentBuilding.engineering_answer}</span>
                    </p>
                  </div>
                )}
              </div>
              <div className="mb-6 p-4 bg-warm-cream rounded">
                <p className="text-gray-700 leading-relaxed mb-4">{currentBuilding.engineering_explanation}</p>
              </div>
              
              {/* Fun Facts */}
              <div className="mb-6 p-4 bg-ochre/10 rounded border-2 border-ochre">
                <h3 className="text-xl font-bold text-fire-red mb-3">Did you know?</h3>
                <ul className="space-y-2">
                  {currentBuilding.fun_facts.map((fact, idx) => (
                    <li key={idx} className="text-gray-700 flex">
                      <span className="text-ochre mr-2">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-burnt-orange hover:bg-fire-red text-ivory py-4 px-6 rounded-lg text-lg font-semibold transition-colors"
              >
                {currentIndex < buildings.length - 1 ? 'Next Building →' : 'Finish Quiz'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
