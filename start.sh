#!/bin/bash

# Start Nginx in background
nginx

# Start Uvicorn in foreground
uvicorn main:app --host 0.0.0.0 --port 8000
