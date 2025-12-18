#!/bin/bash

if [ -z "$TOKEN" ]; then
  echo "ERROR: TOKEN is not set. Run: source scripts/login.sh"
  exit 1
fi


curl http://localhost:3000/tickets \
  -H "Authorization: Bearer $TOKEN"