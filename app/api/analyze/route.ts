import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY_ARCHITECT_APP,
})

export async function POST(request: NextRequest) {
  try {
    const { image, isInitial, messages, initialAnalysis } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Extract base64 data and media type
    const matches = image.match(/^data:(.+);base64,(.+)$/)
    if (!matches) {
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      )
    }

    const mediaType = matches[1]
    const base64Data = matches[2]

    let prompt: string

    if (isInitial) {
      // Initial comprehensive analysis
      prompt = `You are a friendly university architecture professor with deep expertise but a gift for making complex concepts accessible. Analyze this building image as if explaining it to a curious student over coffee.

Keep your response concise but informative - aim for 3-4 short paragraphs covering:

1. **Style & Era**: What style is this and when was it likely built?

2. **Key Features**: What stands out architecturally?

3. **How It Works**: Brief explanation of the structural system and materials.

4. **One Cool Detail**: An interesting tidbit about construction or design.

Write in a warm, conversational tone. Be specific but don't overwhelm with jargon.`
    } else {
      // Follow-up question
      const conversationHistory = messages.map((msg: { role: string; content: string }) => 
        `${msg.role === 'user' ? 'Student' : 'You'}: ${msg.content}`
      ).join('\n\n')

      prompt = `You are a friendly university architecture professor. Here's the conversation so far:

Initial Analysis:
${initialAnalysis}

${conversationHistory}

Answer the latest question in 2-3 sentences. Stay conversational and use analogies when helpful. Reference the image when relevant.`
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: isInitial ? 1500 : 500,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    })

    const analysis = message.content[0].type === 'text' ? message.content[0].text : 'Unable to analyze image'

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Analysis failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
