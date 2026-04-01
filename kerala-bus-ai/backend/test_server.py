#!/usr/bin/env python3
"""Test script to verify the backend API is working"""
import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_health():
    print("Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_stations():
    print("Testing stations endpoint...")
    response = requests.get(f"{BASE_URL}/stations")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Found {len(data['stations'])} stations")
    for station in data['stations'][:3]:
        print(f"  - {station['name']} ({station['code']})")
    print()

def test_chat():
    print("Testing chat endpoint...")
    response = requests.post(f"{BASE_URL}/chat", json={
        "message": "I need to go from Kollam to Kochi tomorrow morning",
        "conversationHistory": []
    })
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Response: {data['response'][:200]}...")
    if data['routes']:
        print(f"Routes found: {len(data['routes'])}")
        for route in data['routes']:
            print(f"  - {route['name']}: ₹{route['fare']} ({route['departure']})")
    print()

if __name__ == "__main__":
    print("=" * 50)
    print("Kerala Bus AI - Backend Test Suite")
    print("=" * 50)
    print()
    
    try:
        test_health()
        test_stations()
        test_chat()
        print("✓ All tests completed!")
    except requests.exceptions.ConnectionError:
        print("✗ Error: Could not connect to server. Make sure it's running on port 5000")
    except Exception as e:
        print(f"✗ Error: {e}")
