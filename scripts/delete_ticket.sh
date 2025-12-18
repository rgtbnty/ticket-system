#!/bin/bash

if [ -z "$TOKEN" ]; then
  echo "ERROR: TOKEN is not set. Run: source scripts/login.sh"
  exit 1
fi

TICKET_ID=""

curl -X DELETE http://localhost:3000/tickets/$TICKET_ID \
  -H "Authorization: Bearer $TOKEN"
