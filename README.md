# Bajaj Health API

REST APIs implementation for Bajaj Health assignment.

## Endpoints

### POST /bfhl
Main endpoint that accepts one of the following keys:
- `fibonacci`: Integer → Returns Fibonacci series
- `prime`: Integer array → Returns prime numbers from the array
- `lcm`: Integer array → Returns LCM value
- `hcf`: Integer array → Returns HCF value
- `AI`: Question string → Returns single-word AI response

**Example Request:**
```json
{
  "fibonacci": 7
}
```

**Example Response:**
```json
{
  "is_success": true,
  "official_email": "your.email@chitkara.edu.in",
  "data": [0, 1, 1, 2, 3, 5, 8]
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "is_success": true,
  "official_email": "your.email@chitkara.edu.in"
}
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update `OFFICIAL_EMAIL` with your Chitkara email
   - Get Google Gemini API key from [https://aistudio.google.com](https://aistudio.google.com)
   - Add `GEMINI_API_KEY` to `.env`

3. **Run the server:**
   ```bash
   npm start
   ```

   Server will run on `http://localhost:3000` (or the port specified in `.env`)

## Getting Google Gemini API Key

1. Visit [https://aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create API key in a new or existing project
5. Copy the key and add it to your `.env` file

## Deployment

### Vercel
1. Login to Vercel
2. New Project → Import repository
3. Configure runtime (Node.js)
4. Add environment variables (OFFICIAL_EMAIL, GEMINI_API_KEY)
5. Deploy and copy public URL

### Railway
1. New Project → Deploy from GitHub
2. Select repository
3. Configure environment variables
4. Deploy and copy URL

### Render
1. New Web Service → Select repository
2. Choose Node.js runtime
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy and copy URL

## Testing

You can test the APIs using:
- Postman
- cURL
- Any HTTP client

**Example cURL commands:**
```bash
# Health check
curl http://localhost:3000/health

# Fibonacci
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"fibonacci": 7}'

# Prime numbers
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"prime": [2, 4, 7, 9, 11]}'

# LCM
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"lcm": [12, 18, 24]}'

# HCF
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"hcf": [24, 36, 60]}'

# AI
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"AI": "What is the capital city of Maharashtra?"}'
```

## Features

- Strict API response structure
- Correct HTTP status codes
- Robust input validation
- Graceful error handling
- Security guardrails
- Public accessibility ready

## Tech Stack

- Node.js
- Express.js
- Google Gemini AI API
