# Getting Started with Gracitecture

## Step 1: Install Dependencies

Open Terminal, navigate to the project folder, and run:

```bash
cd /Users/barnabyhopson/Desktop/ArchitectApp
npm install
```

This will take a minute or two to download all the required packages.

## Step 2: Add Your API Key

1. Get your Anthropic API key from: https://console.anthropic.com/
2. Open the file `.env.local` in a text editor
3. Replace `your_api_key_here` with your actual API key
4. Save the file

Your `.env.local` should look like:
```
ANTHROPIC_API_KEY_ARCHITECT_APP=sk-ant-api03-xxxxxxxxxxxxx
```

## Step 3: Run the Development Server

In Terminal, run:

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
```

## Step 4: Open in Browser

Open your browser and go to: **http://localhost:3000**

You should see the Gracitecture home page with two options:
- **Quiz Mode** - Test your knowledge
- **Analyze Building** - Upload and analyze photos

## Testing the App

### Test Quiz Mode:
1. Click "Quiz Mode"
2. You'll see a placeholder for building images
3. Answer the style question
4. Answer the engineering question
5. Read the fun facts
6. Continue to next building

**Note:** The quiz will show placeholders for images until you add actual images to `/public/images/`

### Test Analyze Mode:
1. Click "Analyze Building"
2. Upload a photo of any building
3. Click "Analyze Building"
4. Wait for Claude to analyze it (takes 5-10 seconds)
5. Read the architectural analysis

## Stopping the Server

Press `Ctrl+C` in the Terminal window to stop the server.

## Next Steps

1. **Add Images**: Download images for the quiz buildings and add them to `/public/images/`
2. **Customize Data**: Edit `/data/buildings.json` to add more buildings or change questions
3. **Test Everything**: Try uploading different building photos to see how Claude analyzes them

## Troubleshooting

### "Module not found" errors
Run: `npm install` again

### "API key not valid"
Check your `.env.local` file - make sure the API key is correct

### Port 3000 already in use
Either:
- Stop whatever is using port 3000
- Or run: `npm run dev -- -p 3001` to use port 3001 instead

### Images not showing
Make sure:
- Image files are in `/public/images/`
- Filenames in `buildings.json` match exactly (case-sensitive)

## Need Help?

Check the main README.md for more detailed information about the project structure and how to customize it.
