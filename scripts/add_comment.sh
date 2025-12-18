#!/bin/bash

if [ -z "$TOKEN" ]; then
  echo "ERROR: TOKEN is not set. Run: source scripts/login.sh"
  exit 1
fi


curl -X POST http://localhost:3000/tickets/$TICKET_ID/comments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"body":"First comment"}'
