# Kerala Bus AI - KSRTC Travel Planning Assistant

An intelligent, conversational web application that transforms Kerala bus travel planning into an effortless experience using AI.

## Features

### Conversational AI Interface
- Natural language understanding for travel queries
- Context-aware conversations with memory
- Multilingual support (English & Malayalam)

### Intelligent Route Planning
- Multiple route options (fastest, cheapest, most comfortable)
- Real-time availability and seat information
- Multi-leg journey planning with connections
- Travel time estimates including wait times

### Smart Optimization
- Time optimization (minimum travel time, fewer transfers)
- Cost optimization (cheapest fares, discounts)
- Comfort preferences (AC buses, limited stops)
- Safety considerations for solo travelers

### Key Information Provided
- Bus names/numbers and types
- Departure and arrival times
- Boarding and dropping points with landmarks
- Fare details and seat availability
- Transfer instructions with wait times

## Project Structure

```
kerala-bus-ai/
├── frontend/          # React-based chat interface
├── backend/           # Python Flask API with AI integration
├── data/              # KSRTC route database and schedules
└── package.json       # Root project configuration
```

## Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.9+
- Anthropic API key (for Claude AI)

### Installation

1. Install dependencies:
```bash
npm install
cd frontend && npm install
cd ../backend
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
# backend/.env
ANTHROPIC_API_KEY=your_api_key_here
FLASK_ENV=development
```

3. Run development servers:
```bash
npm run dev
```

## Usage Examples

### Basic Travel Query
```
User: "I need to go from Kollam to Kochi tomorrow morning"
AI: Provides multiple bus options with timings, fares, and availability
```

### Advanced Planning
```
User: "I want to visit Munnar this weekend, help me plan"
AI: Creates multi-day itinerary with bus connections
```

### Emergency Travel
```
User: "Need to reach hospital in Kottayam ASAP"
AI: Finds fastest available routes with immediate departures
```

## API Endpoints

- `POST /api/chat` - Send message to AI assistant
- `GET /api/routes` - Get route options between two points
- `GET /api/buses` - Get bus schedule information
- `GET /api/stations` - Get list of bus stations

## Technology Stack

### Frontend
- React with Vite
- TailwindCSS for styling
- Socket.io for real-time chat

### Backend
- Flask/FastAPI
- Anthropic Claude API
- SQLite/PostgreSQL for data storage

## License

MIT
