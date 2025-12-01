# Quick Reference: Adding Content to Gracitecture

## Adding a New Building to Quiz

### Step 1: Find an Image
- Use Wikimedia Commons (commons.wikimedia.org) for free, high-quality images
- Look for images labeled "Public Domain" or with Creative Commons licenses
- Download high resolution (at least 1200px wide)

### Step 2: Add Image to Project
1. Save image to: `/Users/barnabyhopson/Desktop/ArchitectApp/public/images/`
2. Use a descriptive filename like: `notre-dame.jpg` or `pantheon.jpg`

### Step 3: Add Building Data
Open `/data/buildings.json` and add a new entry:

```json
{
  "id": "your-unique-id",
  "name": "Building Name",
  "image_url": "/images/your-filename.jpg",
  "style": "Primary Style",
  "style_distractors": ["Similar Style 1", "Similar Style 2", "Similar Style 3"],
  "era": "Construction Period",
  "style_explanation": "Explain why this is that style. What are the key visual features?",
  "engineering_question": "Ask about structural system, materials, or engineering innovation",
  "engineering_answer": "The correct engineering answer",
  "engineering_distractors": ["Plausible wrong answer 1", "Plausible wrong answer 2"],
  "engineering_explanation": "Explain the engineering concept in detail. How does it work?",
  "fun_facts": [
    "Interesting historical fact",
    "Construction challenge or innovation",
    "Cultural impact or significance",
    "Surprising detail about the building"
  ],
  "difficulty": "beginner"
}
```

### Style Distractor Tips
Make distractors similar but distinguishable:
- **For Gothic**: Use Romanesque, Neo-Gothic, Byzantine
- **For Modern**: Use International Style, Brutalist, Art Deco
- **For Classical**: Use Greek, Roman, Neoclassical, Renaissance

### Engineering Question Ideas
- Load-bearing systems (What holds this up?)
- Material innovations (Why this material here?)
- Structural breakthroughs (What makes this possible?)
- Climate adaptations (How does it handle weather?)
- Construction methods (How was this built?)

### Difficulty Levels
- **Beginner**: Famous buildings, obvious features, simple concepts
- **Intermediate**: Less famous, similar styles, moderate complexity
- **Advanced**: Hybrid styles, subtle features, complex engineering

## Example Architectural Styles to Cover

### Ancient
- Egyptian
- Greek
- Roman
- Byzantine

### Medieval
- Romanesque
- Gothic
- Islamic

### Renaissance & Baroque
- Renaissance
- Mannerist
- Baroque
- Rococo

### Modern
- Neoclassical
- Art Nouveau
- Art Deco
- Bauhaus
- International Style
- Brutalist
- Postmodern
- Deconstructivist
- Contemporary

## Engineering Concepts to Cover

### Structural Systems
- Post and beam
- Arch and vault
- Dome
- Truss
- Cantilever
- Shell structure
- Tensile structure
- Moment frame

### Materials
- Stone (compression)
- Wood (tension and compression)
- Brick/masonry
- Concrete (unreinforced vs reinforced)
- Steel (frame, truss)
- Glass curtain walls

### Key Concepts
- Load paths
- Compression vs tension
- Lateral bracing
- Foundation types
- Weatherproofing
- Thermal mass

## After Adding Content

1. Save the `buildings.json` file
2. If the dev server is running, it will auto-reload
3. Test the new building in Quiz Mode
4. Check that:
   - Image displays correctly
   - Questions make sense
   - Distractors are plausible
   - Explanations are clear
