#!/bin/bash

curl -X 'POST' \
  'http://localhost:5000/auth/signup' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "Abel",
  "password": "12345678"
}'