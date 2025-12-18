#!/bin/bash

API_URL="http://localhost:3000"
EMAIL="test+1@example.com"
PASSWORD="1234567"

response=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

TOKEN=$(echo "$response" | jq -r '.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "Login failed"
  echo "$response"
  return 1
fi

export TOKEN
echo "Login successful"
echo "TOKEN exported"
