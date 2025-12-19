#!/bin/bash

if [ -z "$TOKEN" ]; then
  echo "ERROR: TOKEN is not set. Run: source scripts/login.sh"
  exit 1
fi

curl -i -X DELETE http://localhost:3000/comments/$COMMENT_ID \
  -H "Authorization: Bearer $TOKEN"