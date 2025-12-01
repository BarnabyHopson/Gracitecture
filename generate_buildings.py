#!/usr/bin/env python3
"""
Generate building entries for buildings.json using Claude API
"""
import json
import os
from pathlib import Path
import anthropic

def generate_building_entry(building_name, style):
    """Generate a complete building entry using Claude API"""
    
    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    
    prompt = f"""Generate a complete JSON entry for this building for an architecture learning app:

Building: {building_name}
Style: {style}

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{{
  "id": "kebab-case-id",
  "name": "{building_name}",
  "image_url": "/images/kebab-case-id.jpg",
  "style": "{style}",
  "style_distractors": ["distractor1", "distractor2", "distractor3"],
  "era": "start-end years",
  "style_explanation": "2-3 sentence explanation of why this building exemplifies this style",
  "engineering_question": "Question about a structural/engineering feature",
  "engineering_answer": "Correct answer (2-5 words)",
  "engineering_distractors": ["wrong1", "wrong2", "wrong3"],
  "engineering_explanation": "2-3 sentence explanation of the engineering feature",
  "fun_facts": [
    "Fact 1",
    "Fact 2", 
    "Fact 3",
    "Fact 4"
  ],
  "difficulty": "beginner"
}}

Rules:
- Style distractors must be plausible but wrong architectural styles
- Engineering question should be specific to this building's innovations
- Engineering distractors must be plausible but incorrect
- Fun facts should be interesting, factual, and varied
- Era should be construction dates or period
- ID should be lowercase with hyphens (e.g., "hagia-sophia")
- Difficulty: "beginner" for famous buildings, "intermediate" for moderately known, "advanced" for specialist knowledge"""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    )
    
    # Parse the response
    response_text = message.content[0].text.strip()
    
    # Remove markdown code blocks if present
    if response_text.startswith("```"):
        response_text = response_text.split("```")[1]
        if response_text.startswith("json"):
            response_text = response_text[4:]
        response_text = response_text.strip()
    
    return json.loads(response_text)

def main():
    # Check for API key
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("❌ Error: ANTHROPIC_API_KEY not found in environment")
        print("Run: export ANTHROPIC_API_KEY='your-key-here'")
        return
    
    # Load existing buildings
    data_path = Path(__file__).parent / "data" / "buildings.json"
    
    with open(data_path, 'r') as f:
        existing_buildings = json.load(f)
    
    print(f"Current buildings: {len(existing_buildings)}")
    print(f"Target: 75 buildings (need {75 - len(existing_buildings)} more)\n")
    
    # New buildings to add - add your buildings here
    new_buildings = [
        # Baroque (need 5 more)
        {"name": "St. Peter's Basilica", "style": "Baroque"},
        {"name": "Palace of Versailles", "style": "Baroque"},
        {"name": "Church of Sant'Ivo alla Sapienza", "style": "Baroque"},
        {"name": "Würzburg Residence", "style": "Baroque"},
        {"name": "Karlskirche Vienna", "style": "Baroque"},
        
        # Islamic (5)
        {"name": "Taj Mahal", "style": "Islamic"},
        {"name": "Alhambra", "style": "Islamic"},
        {"name": "Blue Mosque", "style": "Islamic"},
        {"name": "Great Mosque of Cordoba", "style": "Islamic"},
        {"name": "Dome of the Rock", "style": "Islamic"},
        
        # Byzantine (5)
        {"name": "Hagia Sophia", "style": "Byzantine"},
        {"name": "Basilica of San Vitale", "style": "Byzantine"},
        {"name": "Basilica Cistern", "style": "Byzantine"},
        {"name": "Chora Church", "style": "Byzantine"},
        {"name": "Cathedral of Monreale", "style": "Byzantine"},
        
        # Romanesque (5)
        {"name": "Durham Cathedral", "style": "Romanesque"},
        {"name": "Pisa Cathedral", "style": "Romanesque"},
        {"name": "Speyer Cathedral", "style": "Romanesque"},
        {"name": "Abbey of Cluny", "style": "Romanesque"},
        {"name": "Santiago de Compostela Cathedral", "style": "Romanesque"},
        
        # Art Nouveau (5)
        {"name": "Casa Batlló", "style": "Art Nouveau"},
        {"name": "Hôtel Tassel", "style": "Art Nouveau"},
        {"name": "Glasgow School of Art", "style": "Art Nouveau"},
        {"name": "Casa Milà", "style": "Art Nouveau"},
        {"name": "Secession Building", "style": "Art Nouveau"},
        
        # Art Deco (5)
        {"name": "Chrysler Building", "style": "Art Deco"},
        {"name": "Empire State Building", "style": "Art Deco"},
        {"name": "Hoover Dam", "style": "Art Deco"},
        {"name": "Radio City Music Hall", "style": "Art Deco"},
        {"name": "Palais de Tokyo", "style": "Art Deco"},
        
        # Modernist (5)
        {"name": "Villa Savoye", "style": "Modernist"},
        {"name": "Fallingwater", "style": "Modernist"},
        {"name": "Barcelona Pavilion", "style": "Modernist"},
        {"name": "Seagram Building", "style": "Modernist"},
        {"name": "Farnsworth House", "style": "Modernist"},
        
        # Brutalist (5)
        {"name": "Habitat 67", "style": "Brutalist"},
        {"name": "National Theatre London", "style": "Brutalist"},
        {"name": "Barbican Estate", "style": "Brutalist"},
        {"name": "Boston City Hall", "style": "Brutalist"},
        {"name": "Trellick Tower", "style": "Brutalist"},
        
        # Neoclassical (5)
        {"name": "The Panthéon Paris", "style": "Neoclassical"},
        {"name": "Brandenburg Gate", "style": "Neoclassical"},
        {"name": "The White House", "style": "Neoclassical"},
        {"name": "British Museum", "style": "Neoclassical"},
        {"name": "La Madeleine", "style": "Neoclassical"},
        
        # Contemporary (5)
        {"name": "Guggenheim Bilbao", "style": "Contemporary"},
        {"name": "Beijing National Stadium", "style": "Contemporary"},
        {"name": "Burj Khalifa", "style": "Contemporary"},
        {"name": "The Shard", "style": "Contemporary"},
        {"name": "CCTV Headquarters", "style": "Contemporary"}
    ]
    
    print(f"Will generate {len(new_buildings)} new building entries\n")
    print("This will take ~10 minutes (avoid rate limits)...\n")
    
    generated = []
    failed = []
    
    for i, building_info in enumerate(new_buildings, 1):
        building_name = building_info["name"]
        style = building_info["style"]
        
        print(f"[{i}/{len(new_buildings)}] Generating: {building_name} ({style})")
        
        try:
            entry = generate_building_entry(building_name, style)
            generated.append(entry)
            print(f"  ✓ Generated successfully")
        except Exception as e:
            print(f"  ❌ Failed: {str(e)}")
            failed.append(building_info)
        
        # Rate limiting - wait between requests
        if i < len(new_buildings):
            import time
            time.sleep(2)
    
    if generated:
        # Append to existing buildings
        all_buildings = existing_buildings + generated
        
        # Save updated file
        with open(data_path, 'w') as f:
            json.dump(all_buildings, f, indent=2)
        
        print(f"\n{'='*50}")
        print(f"✓ Added {len(generated)} buildings to buildings.json")
        print(f"Total buildings: {len(all_buildings)}")
        if failed:
            print(f"\n❌ Failed to generate {len(failed)} buildings:")
            for b in failed:
                print(f"  - {b['name']}")
        print(f"{'='*50}")
    else:
        print("\n❌ No buildings were generated successfully")

if __name__ == "__main__":
    main()
