#!/bin/bash

if [ -z "$TOKEN" ]; then
  echo "ERROR: TOKEN is not set. Run: source scripts/login.sh"
  exit 1
fi


curl -X GET http://localhost:3000/tickets/$TICKET_ID/comments \
  -H "Authorization: Bearer $TOKEN"
