#!/bin/bash

if [ -z "$TOKEN" ]; then
  echo "ERROR: TOKEN is not set. Run: source scripts/login.sh"
  exit 1
fi


TICKET_ID=""

curl -i -X PATCH http://localhost:3000/tickets/$TICKET_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated title",
    "status": "in_progress"
  }'