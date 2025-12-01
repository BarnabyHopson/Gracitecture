# Gracitecture

An interactive learning application for architecture students and enthusiasts. Learn architectural styles and structural engineering principles through visual quizzes and AI-powered analysis.

## Features

### Quiz Mode
- Curated examples of famous buildings
- Combined style identification + engineering questions
- Immediate feedback with explanations
- Fun facts about each building
- Progress tracking

### Analyze Mode
- Upload photos of any building
- AI-powered analysis using Claude
- Identifies architectural style, era, and key features
- Explains structural systems and engineering principles

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Your Anthropic API Key

Open the `.env.local` file and replace `your_api_key_here` with your actual Anthropic API key:

```
ANTHROPIC_API_KEY_ARCHITECT_APP=sk-ant-xxxxxxxxxxxxx
```

Get your API key from: https://console.anthropic.com/

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Adding Quiz Content

### Adding Buildings to Quiz

Edit `/data/buildings.json` to add more buildings. Each entry should include:

```json
{
  "id": "unique-id",
  "name": "Building Name",
  "image_url": "/images/filename.jpg",
  "style": "Correct Style",
  "style_distractors": ["Wrong 1", "Wrong 2", "Wrong 3"],
  "era": "Time Period",
  "style_explanation": "Why this is that style...",
  "engineering_question": "Your question?",
  "engineering_answer": "Correct answer",
  "engineering_distractors": ["Wrong 1", "Wrong 2"],
  "engineering_explanation": "How it works...",
  "fun_facts": ["Fact 1", "Fact 2", "Fact 3"],
  "difficulty": "beginner|intermediate|advanced"
}
```

### Adding Images

1. Find high-quality, public domain images (Wikimedia Commons is excellent)
2. Save them to `/public/images/`
3. Reference them in `buildings.json` as `/images/your-file.jpg`
4. Recommended size: 1200x800px or similar

## Project Structure

```
ArchitectApp/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts      # Claude API integration
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page (mode selection)
│   └── globals.css           # Global styles
├── components/
│   ├── Quiz.tsx              # Quiz component
│   └── UploadAnalyze.tsx     # Upload & analyze component
├── data/
│   └── buildings.json        # Quiz content
└── public/
    └── images/               # Building images
```

## Color Scheme

- **Ivory**: #FFFFF0 (backgrounds)
- **Ochre**: #CC7722 (primary accent)
- **Burnt Orange**: #CC5500 (buttons, highlights)
- **Fire Red**: #E25822 (headings, emphasis)
- **Warm Cream**: #FFF8DC (secondary background)

## Technologies

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Anthropic Claude API** (Sonnet 4)
- **React**

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variable: `ANTHROPIC_API_KEY_ARCHITECT_APP`
4. Deploy

## Future Enhancements

- [ ] User accounts and progress tracking
- [ ] Difficulty levels (beginner/intermediate/advanced filters)
- [ ] Spaced repetition for better learning
- [ ] Community submissions
- [ ] More engineering question types
- [ ] Video explanations
- [ ] Mobile app version

## License

Personal/Educational Use

---

Built with curiosity and a love for architecture.
