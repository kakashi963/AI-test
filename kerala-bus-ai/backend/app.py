from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import anthropic
import json
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Anthropic client if API key is available
ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')
client = None
if ANTHROPIC_API_KEY:
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

# Sample KSRTC route database
KSRTC_ROUTES = {
    'kollam-kochi': [
        {
            'name': 'Super Fast AC',
            'bus_number': 'KA-501',
            'departure': '08:15 AM',
            'arrival': '10:45 AM',
            'duration': '2h 30m',
            'fare': 145,
            'seats_available': 12,
            'type': 'AC',
            'boarding_point': 'Kollam KSRTC Stand',
            'dropping_point': 'Ernakulam KSRTC Stand',
            'recommended': True
        },
        {
            'name': 'Fast Passenger',
            'bus_number': 'KL-202',
            'departure': '07:45 AM',
            'arrival': '11:00 AM',
            'duration': '3h 15m',
            'fare': 120,
            'seats_available': 25,
            'type': 'Non-AC',
            'boarding_point': 'Kollam KSRTC Stand',
            'dropping_point': 'Ernakulam Town',
            'recommended': False
        }
    ],
    'thrissur-trivandrum': [
        {
            'name': 'Trivandrum Express',
            'bus_number': 'KA-301',
            'departure': '06:00 AM',
            'arrival': '09:30 AM',
            'duration': '3h 30m',
            'fare': 180,
            'seats_available': 8,
            'type': 'AC',
            'boarding_point': 'Thrissur Round',
            'dropping_point': 'Trivandrum Central',
            'recommended': True
        }
    ],
    'ernakulam-munnar': [
        {
            'name': 'Munnar Hill Station Special',
            'bus_number': 'KL-405',
            'departure': '07:00 AM',
            'arrival': '11:30 AM',
            'duration': '4h 30m',
            'fare': 220,
            'seats_available': 15,
            'type': 'AC',
            'boarding_point': 'Ernakulam South',
            'dropping_point': 'Munnar Town',
            'recommended': True
        }
    ]
}

def get_ai_response(message, conversation_history):
    """Get response from Claude AI"""
    if not client:
        return None
    
    system_prompt = """You are Kerala Bus AI, an intelligent travel assistant for KSRTC (Kerala State Road Transport Corporation). 
    Your role is to help users plan their bus journeys across Kerala.
    
    Key capabilities:
    - Understand natural language queries about bus routes
    - Provide multiple route options with trade-offs
    - Consider factors like time, cost, comfort, and convenience
    - Handle multi-city itineraries
    - Support both English and Malayalam
    
    Always be helpful, friendly, and provide clear information about:
    - Bus names/numbers and types (Ordinary, Fast, Super Fast, AC)
    - Departure and arrival times
    - Boarding and dropping points with landmarks
    - Fare details
    - Seat availability
    - Journey duration
    - Transfer instructions if needed
    
    Format your responses clearly with bullet points and emojis where appropriate."""
    
    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=system_prompt,
            messages=[
                {"role": "user", "content": message}
            ]
        )
        return response.content[0].text
    except Exception as e:
        print(f"AI Error: {e}")
        return None

def parse_route_request(message):
    """Extract route information from user message"""
    message_lower = message.lower()
    
    routes_data = []
    
    # Check for common routes
    if 'kollam' in message_lower and ('kochi' in message_lower or 'ernakulam' in message_lower):
        routes_data = KSRTC_ROUTES.get('kollam-kochi', [])
    elif ('thrissur' in message_lower or 'trichur' in message_lower) and ('trivandrum' in message_lower or 'thiruvananthapuram' in message_lower):
        routes_data = KSRTC_ROUTES.get('thrissur-trivandrum', [])
    elif ('ernakulam' in message_lower or 'kochi' in message_lower) and 'munnar' in message_lower:
        routes_data = KSRTC_ROUTES.get('ernakulam-munnar', [])
    
    return routes_data

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    conversation_history = data.get('conversationHistory', [])
    
    # Parse route information
    routes = parse_route_request(message)
    
    # Try to get AI response
    ai_response = get_ai_response(message, conversation_history)
    
    if ai_response:
        response_text = ai_response
    else:
        # Fallback response
        if routes:
            response_text = f"Great! I found {len(routes)} bus option(s) for your journey. Here are the details:"
        else:
            response_text = f"Thank you for your query: \"{message}\"\n\nI can help you with KSRTC bus routes, schedules, and travel planning. Please tell me:\n• Where are you traveling from?\n• Where do you want to go?\n• When do you want to travel?\n• Any preferences (AC, budget, fastest)?"
    
    return jsonify({
        'response': response_text,
        'routes': routes,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/routes', methods=['GET'])
def get_routes():
    from_location = request.args.get('from', '').lower()
    to_location = request.args.get('to', '').lower()
    
    # Simple route matching
    for key, routes in KSRTC_ROUTES.items():
        if from_location in key and to_location in key:
            return jsonify({'routes': routes})
    
    return jsonify({'routes': []})

@app.route('/api/stations', methods=['GET'])
def get_stations():
    stations = [
        {'name': 'Kollam KSRTC Stand', 'city': 'Kollam', 'code': 'KLM'},
        {'name': 'Ernakulam KSRTC Stand', 'city': 'Kochi', 'code': 'ERN'},
        {'name': 'Thrissur Round', 'city': 'Thrissur', 'code': 'TCR'},
        {'name': 'Trivandrum Central', 'city': 'Trivandrum', 'code': 'TVM'},
        {'name': 'Munnar Town', 'city': 'Munnar', 'code': 'MNR'},
        {'name': 'Kozhikode KSRTC Stand', 'city': 'Kozhikode', 'code': 'CLT'},
        {'name': 'Palakkad KSRTC Stand', 'city': 'Palakkad', 'code': 'PKD'},
        {'name': 'Kannur KSRTC Stand', 'city': 'Kannur', 'code': 'CNN'}
    ]
    return jsonify({'stations': stations})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'ai_enabled': client is not None,
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
